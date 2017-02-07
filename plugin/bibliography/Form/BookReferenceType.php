<?php

namespace Icap\BibliographyBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class BookReferenceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'name',
            'text',
            [
                'required' => true,
                'label' => 'name',
                'constraints' => new Assert\NotBlank(),
                'attr' => [
                    'autofocus' => true,
                ],
            ]
        );

        $builder->add(
            'author',
            'text',
            [
                'required' => true,
                'label' => 'author',
                'constraints' => new Assert\NotBlank(),
            ]
        );

        $builder->add(
            'description',
            'tinymce',
            [
                'required' => false,
                'label' => 'description',
            ]
        );

        $builder->add(
            'abstract',
            'tinymce',
            [
                'required' => false,
                'label' => 'abstract',
            ]
        );

        $builder->add(
            'isbn',
            'text',
            [
                'required' => false,
                'label' => 'isbn',
                'constraints' => new Assert\Length(['min' => 10, 'max' => 14]),
            ]
        );

        $builder->add(
            'publisher',
            'text',
            [
                'required' => false,
                'label' => 'publisher',
            ]
        );

        $builder->add(
            'printer',
            'text',
            [
                'required' => false,
                'label' => 'printer',

            ]
        );

        $builder->add(
            'publicationYear',
            'integer',
            [
                'required' => false,
                'label' => 'publication_year',
                'constraints' => new Assert\Range(['min' => 0]),
            ]
        );

        $builder->add(
            'language',
            'language',
            [
                'required' => false,
                'label' => 'language',
            ]
        );

        $builder->add(
            'pageCount',
            'integer',
            [
                'required' => false,
                'label' => 'page_count',
                'constraints' => new Assert\Range(['min' => 1]),
            ]
        );

        $builder->add(
            'url',
            'url',
            [
                'required' => false,
                'label' => 'url',
                'constraints' => new Assert\Url(['checkDNS' => true]),
            ]
        );

        $builder->add(
            'coverUrl',
            'url',
            [
                'required' => false,
                'label' => 'cover_url',
                'constraints' => new Assert\Url(['checkDNS' => true]),
            ]
        );
    }

    public function getName()
    {
        return 'icap_bibliography_type';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'translation_domain' => 'icap_bibliography',
            'data_class' => 'Icap\BibliographyBundle\Entity\BookReference',
            'csrf_protection' => true,
            'intention' => 'create_book_reference',
        ]);
    }
}
