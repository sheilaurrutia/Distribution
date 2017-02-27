<?php

namespace Icap\BibliographyBundle\Manager;

use Icap\BibliographyBundle\Repository\BookReferenceConfigurationRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @DI\Service("icap.bookReference.manager")
 */
class BookReferenceManager
{
    protected $container;
    protected $repository;

    /**
     * @DI\InjectParams({
     *      "container"   = @DI\Inject("service_container"),
     *      "repository"  = @DI\Inject("icap_bibliography.repository.book_reference_configuration")
     * })
     */
    public function __construct(ContainerInterface $container, BookReferenceConfigurationRepository $repository)
    {
        $this->container = $container;
        $this->repository = $repository;
    }

    public function updateConfiguration(AudioRecorderConfiguration $config, $postData)
    {
        $om = $this->container->get('claroline.persistence.object_manager');

        $om->persist($config);
        $om->flush();
    }

    public function getConfig()
    {
        $config = $this->container->get('doctrine.orm.entity_manager');
        $config = $this->repository->findAll()[0];

        return $config;
    }
}
