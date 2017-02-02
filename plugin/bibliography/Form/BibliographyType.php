<?php

namespace Icap\bibliographyBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BibliographyType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', 'text', ['attr' => ['autofocus' => true]]);
    }

    public function getName()
    {
        return 'icap_bibliography_type';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'translation_domain' => 'icap_bibliography',
            'data_class' => 'Icap\BibliographyBundle\Entity\Document',
            'csrf_protection' => true,
            'intention' => 'create_document',
        ]);
    }
}
