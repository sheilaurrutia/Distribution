<?php

namespace Icap\BibliographyBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BookReferenceConfigurationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults($this->getDefaultOptions());

        return $this;
    }

    public function getDefaultOptions()
    {
        return [
          'data_class' => 'Icap\BibliographyBundle\Entity\BookReferenceConfiguration',
          'translation_domain' => 'icap_bibliography',
      ];
    }

    public function getName()
    {
        return 'bibliography_configuration';
    }
}
