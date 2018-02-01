<?php

namespace Core\TestBundle\Controller;

use Core\TestBundle\Dumpers\ValidatorDumper01;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

class DefaultController extends Controller
{
    /**
     * @Route("/json")
     */
    public function indexAction(Request $request)
    {
        error_reporting(E_ALL);
        ini_set('display_errors',1);

        $state = json_decode(file_get_contents("php://input"), true) ?: array();

        $state = array_merge($_POST, $state);

        $state['deep'] = array(
            array(
                'sorted' => 1,
                'name' => 'e',
                'title' => 'f'
            ),
            array(
                'sorted' => 2,
                'name' => 'h',
                'title' => 'f'
            )
        );

        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
//        sleep(1);

        /* @var $validator ConstraintViolationList */
        /**
         * list of http://api.symfony.com/master/Symfony/Component/Validator/ConstraintViolation.html
         *
         */

        if ($request->isMethod('POST')) {

            $validator = $this->validation($state);

//            $validator->

            if ($validator->count()) {

                $state = array();

                foreach ($validator as $key => $valida) {

                    $state[$valida->getPropertyPath()] = $valida->getMessage();
                }


                die(print_r($state));

//                try {
//
//                    $errors = ValidatorDumper01::getInstance()->dump($validator);
//                }
//                catch(\Exception $e) {
//
//                    die(var_dump($e->getMessage()));
//                }
////
//                die(print_r($errors));


//                $errors = array();
//
//                foreach ($validator as $valida) {
//
//                    var_dump($valida);
//                    die(print_r($valida));
//
//                    $errors[] = array(
////                        '__toString()' => $validator.'',
////                        'getMessageTemplate' => $validator->getMessageTemplate(),
////                        'getParameters' => $validator->getParameters(),
//                        'getPlural' => $valida->getPlural(),
//                        'getMessage' => $valida->getMessage(),
//                        'getRoot' => $valida->getRoot(),
//                        'getPropertyPath' => $valida->getPropertyPath(),
////                        'getInvalidValue' => $validator->getInvalidValue(),
//                        'getConstraint' => $valida->getConstraint(),
////                        'getCause' => $validator->getCause(),
////                        'getCode' => $validator->getCode(),
//                    );
//
//                    var_dump($errors);
//                    print_r($errors);
//                }


                die(json_encode(array(
                    'data' => $state ?: array()
                )));
            }
        }


        $file = 'db.json';

        if ($state) {

            if (file_exists($file)) {
                unlink($file);
            }

            if (version_compare(PHP_VERSION, '5.4', '>=')) {
                $data = json_encode($state, JSON_PRETTY_PRINT);
            }
            else {
                $data = json_encode($state);
            }

            file_put_contents($file, $data, FILE_APPEND);
        }
        else {
            if (file_exists($file)) {
                $state = json_decode(file_get_contents($file), true) ?: array();
            }
        }


        die(json_encode(array(
            'data' => $state ?: array()
        )));
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
                    new Assert\Email(), // WARNING - by default it's Assert\Required if defined in flat way like this
                    new Assert\NotBlank() // WARNING - by default it's Assert\Required
                )),
                // Required|Optional - tells if this field should exist or not (Require generate: "This field is missing." error)
                // Must use one of above if you have more then one validator
                'deep' => new Assert\Required(array(
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
                                'sorted' => new Assert\Optional( // ref: 1
                                    new Assert\Type('int')
                                ),
                                'name' => new Assert\NotBlank(),  // WARNING - by default it's Assert\Required
                                'title' => new Assert\NotBlank()  // WARNING - by default it's Assert\Required
                            )),
                        )
                    )),
                    new Assert\Callback(function ($object, ExecutionContextInterface $context, $payload) {

                        // lets check if values are sorted
                        $tmp = 0;

                        foreach ($object as $key => $item) {

                            if (!isset($item['sorted'])) { // because i setup Assert\Optional on this field (ref: 1)

                                continue;
                            }

                            if ($item['sorted'] > $tmp) {

                                $tmp = $item['sorted'];

                                continue;
                            }

                            $context->buildViolation("Values in field 'sorted' are not sorted")
                                ->atPath($key) // [[deep].0] => Values in field 'sorted' are not sorted
                                ->addViolation()
                            ;
                        }
                    })
                )),
                'custom' => new Assert\Required(array(

                ))
            ),
            'allowExtraFields' => true,
//            'extraFieldsMessage' => 'myMessage',
        )));
    }
}
