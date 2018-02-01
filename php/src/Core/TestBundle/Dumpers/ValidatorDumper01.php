<?php

namespace Core\TestBundle\Dumpers;

use Stopsopa\LiteSerializer\Dumper;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Optional;
use Symfony\Component\Validator\Constraints\Required;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Constraints\Collection;
use Symfony\Component\Validator\Constraints\Existence;
use Symfony\Component\Validator\Constraint;

class ValidatorDumper01 extends Dumper {

    public function dumpSymfonyComponentValidator_ConstraintViolation($entity) {

        /* @var $entity ConstraintViolation */

//        die(var_dump($entity));

        $data = $this->toArray($entity, array(
            'error' => 'message',
            'path'  => 'propertyPath',
            'constraint'  => 'constraint'
        ));

//        if ($entity->getConstraint() instanceof Collection) {
//
//            $tmp = array();
//
//            foreach ($entity->getConstraint()->fields as $key => $field) {
//
//                if ($field instanceof Existence) {
//
//                    /* @var $field Optional */
//
//                    $tmp[$key] = $this->innerDump($field->constraints);
//
//                    continue;
//                }
//
//                $tmp[$key] = $this->innerDump($field);
//            }
//
//            $data['constraint'] = $tmp;
//        }

        if (!empty($data['path'])) {

            $data['path'] = trim($data['path'], '[]');
        }

        return $data;
    }
    public function dumpSymfonyComponentValidatorConstraints_Collection($entity) {

        /* @var $entity Collection */

        $tmp = array();

        foreach ($entity->fields as $key => $field) {

            if ($field instanceof Existence) {

                /* @var $field Optional */

                $tmp[$key] = $this->innerDump($field->constraints);

                continue;
            }

            $tmp[$key] = $this->innerDump($field);
        }

        return $tmp;
    }
    public function dumpSymfonyComponentValidatorConstraints_Email($entity) {

        /* @var $entity Email */

        return $entity->message;
    }
    public function dumpSymfonyComponentValidatorConstraints_NotBlank($entity) {

        /* @var $entity NotBlank */

        return $entity->message;
    }
    public function dumpSymfonyComponentValidatorConstraints_Required($entity) {

        /* @var $entity Optional */
        return $this->innerDump($entity->constraints);
    }
//    public function dumpSymfonyComponentValidatorConstraints_Collection($entity) {
//
//        /* @var $entity Collection */
//
//        $entity->fields;
//        die(var_dump($entity));
//
//    }
}
