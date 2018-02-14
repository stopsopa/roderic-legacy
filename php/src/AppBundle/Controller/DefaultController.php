<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function homeAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }
    /**
     * @Route("/json")
     */
    public function indexAction(Request $request)
    {
        error_reporting(E_ALL);

        ini_set('display_errors',1);

        $state = array(
            "input" => '',
            "email" => '',
            "description" => 'default',
            "radio" => 'female',
            "checkbox" => false,
            "checkboxcomponent" => false,
            "withoutcheckbox" => false,
            "single" => '',
            "multiple" => [],
            "list" => [],
        );

        $postState = json_decode(file_get_contents("php://input"), true) ?: array();

        if ($postState) {

            $state = array_merge($state, $postState);
        }

        // commented because i'm sending data in first level (of course i can change it explicitly)
        // $state = $state['data'] ?? array();

        $errors = array();

        header('Content-Type: application/json');

        header('Cache-Control: no-cache');

        /* @var $validator ConstraintViolationList */
        /**
         * list of http://api.symfony.com/master/Symfony/Component/Validator/ConstraintViolation.html
         */

        $file = 'db.json';

        if ($request->isMethod('POST')) {

            $validator = $this->validation($state);

//                        $validator = array(); // just for test

            if ($validator && $validator->count()) { // invalid

                foreach ($validator as $key => $valida) {

                    $errors[$valida->getPropertyPath()] = $valida->getMessage();
                }
            }
            else { // valid

//                die(print_r($state));

//                file_exists($file) and unlink($file);
//
//                unset($state['_errors']);
//
//                unset($state['data']);
//
//                $data = json_encode($state, JSON_PRETTY_PRINT);
//
//                file_put_contents($file, $data, FILE_APPEND);
            }
        }
        else {

            if (file_exists($file)) {

                $state = json_decode(file_get_contents($file), true) ?: array();
            }
        }

        return new JsonResponse(array(
            'data'      => $state,
            '_errors'   => $this->normalizeErrors($errors)
        ));
    }

    /**
     * @param array $data
     * @return ConstraintViolationListInterface
     *
     * use Symfony\Component\Validator\ConstraintViolationList;
     *
     * https://symfony.com/doc/master/validation/raw_values.html
     */
    protected function validation($data) {

        // https://symfony.com/doc/master/reference/constraints/Collection.html
        // allowExtraFields: https://github.com/symfony/validator/blob/c3736ce911b718bd7e6174af6e3513b814d1368b/Constraints/Collection.php#L45
        // use case example: https://github.com/symfony/validator/blob/c3736ce911b718bd7e6174af6e3513b814d1368b/Tests/Constraints/CollectionValidatorTest.php#L179
        // available types of validators:
        //   https://symfony.com/doc/master/validation.html
        //
        // validators examples:
        //   choice: https://symfony.com/doc/master/validation.html#constraint-configuration

        // collections:
        //   https://symfony.com/doc/master/validation/raw_values.html
        return Validation::createValidator()->validate($data, new Assert\Collection(array( // constructor: https://github.com/symfony/validator/blob/c3736ce911b718bd7e6174af6e3513b814d1368b/Constraints/Collection.php#L41
            'fields' => array(
                // primitive value validation (not array|object)
                'email' => new Assert\Optional(array(
                    new Assert\Email(),
                    new Assert\NotBlank()
                )),
                'description' => new Assert\Length(array( // WARNING - by default it's Assert\Required if defined in flat way like this
                    'min' => 15
                )),
                'single' => new Assert\Required(array(
                    new Assert\Choice(array( // single select option
                        'choices' => array('apple', 'banana', 'cranberry')
                    )),
                    new Assert\NotBlank(), // WARNING: in order to see this message first put it on the end (last one wins)
                )),
                'multiple' => new Assert\Required(array( // multiple select option
                    new Assert\All(array(
                        new Assert\Choice(array(
                            'choices' => array('apple', 'banana', 'cranberry')
                        ))
                    )),
                    new Assert\Count(array(
                        'min' => 2,
                        'max' => 2
                    ))
                )),
                // Required|Optional - tells if this field should exist or not (Require generate: "This field is missing." error)
                // Must use one of above if you have more then one validator
                'list' => new Assert\Required(array(
                    // Count execute count() function on this value (whatever it is, must bi Countable)
                    // and validate received value
                    new Assert\Count(array(
                        'min' => 1
                    )),
                    // All defines that it won't be one value but list of values
                    new Assert\All(array(
                        'constraints' => array(
                            // Collection defines that individual object is complex not primitive type
                            new Assert\Collection(array(
                                'title' => new Assert\Optional(array( // ref: 1
                                    new Assert\Type('string'),
                                    new Assert\Length(array(
                                        'min' => 5
                                    )),
                                    new Assert\Regex(array(
                                        'pattern' => '/^\./',
                                        'message' => 'Title must start from .'
                                    ))
                                )),
                                'num' => new Assert\Required(array(
                                    new Assert\Type('int'),
                                    new Assert\Range(array(
                                        'min' => 0
                                    )),
                                    new Assert\Range(array( // last one wins - try to put to form values 0 and -1 and check what's will happen
                                        'minMessage' => 'Num value should be {{ limit }} or more.',
                                        'min' => -1
                                    )),
                                ))
                            )),
                        )
                    )),
                    new Assert\Callback(function ($object, ExecutionContextInterface $context, $payload) {

                        // lets check if values are sorted
                        $tmp = -1;

                        foreach ($object as $key => $item) {

                            if (!isset($item['num'])) { // because i setup Assert\Optional on this field (ref: 1)

                                continue;
                            }

                            if ($item['num'] > $tmp) {

                                $tmp = $item['num'];

                                continue;
                            }

                            // key = 0
                            $context->buildViolation("Values in column 'num' are not sorted from highest to lowest")
                                ->atPath('') // [[deep].0] => Values in field 'sorted' are not sorted
                                ->addViolation()
                            ;
                        }
                    })
                ))
            ),
            'allowExtraFields' => true,
//            'extraFieldsMessage' => 'myMessage',
        )));
    }

    protected function normalizePath($path) {

        $strip = '[.]';

        $path = trim($path, $strip);

        $path = preg_replace("#[" . preg_quote($strip, '#') . "]+#", '.', $path);

        return $path;
    }
    protected function normalizeErrors($errors) {

        $tmp = array();

        foreach ($errors as $key => $val) {

            $tmp[$this->normalizePath($key)] = $val;
        }

        return $tmp;
    }
}
