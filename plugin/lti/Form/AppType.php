<?php

namespace UJM\LtiBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class AppType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'title', 'text', array(
                    'label' => ' ',
                    'attr' => array('style' => 'height:34px; ',
                        'class' => 'form-control',
                        'placeholder' => 'title',
                    ),
                )
            )
            ->add(
                'url', 'text', array(
                    'label' => ' ',
                    'attr' => array('style' => 'height:34px; ',
                        'class' => 'form-control',
                        'placeholder' => 'url',
                    ),
                )
            )
            ->add(
                'appkey', 'text', array(
                    'label' => ' ',
                    'required' => false,
                    'attr' => array('style' => 'height:34px; ',
                        'class' => 'form-control',
                        'placeholder' => 'key',
                    ),
                )
            )
            ->add(
                'secret', 'text', array(
                    'label' => ' ',
                    'required' => false,
                    'attr' => array('style' => 'height:34px; ',
                        'class' => 'form-control',
                        'placeholder' => 'secret',
                    ),
                )
            )
            ->add(
                'description', 'textarea', array(
                    'label' => ' ',
                    'required' => false,
                    'attr' => array('style' => 'height:34px; ',
                        'class' => 'form-control',
                        'placeholder' => 'description',
                    ),
                )
            );
    }
    public function getName()
    {
        return 'platform_parameters_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array('translation_domain' => 'lti'));
    }
}
