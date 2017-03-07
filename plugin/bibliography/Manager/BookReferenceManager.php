<?php

namespace Icap\BibliographyBundle\Manager;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @DI\Service("icap.bookReference.manager")
 */
class BookReferenceManager
{
    private $om;
    protected $container;
    protected $repository;

    /**
     * @DI\InjectParams({
     *      "container"   = @DI\Inject("service_container"),
     *     "om"        = @DI\Inject("claroline.persistence.object_manager"),
     * })
     */
    public function __construct(ContainerInterface $container, ObjectManager $om)
    {
        $this->om = $om;
        $this->container = $container;
        $this->repository = $this->om->getRepository('IcapBibliographyBundle:BookReferenceConfiguration');
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
