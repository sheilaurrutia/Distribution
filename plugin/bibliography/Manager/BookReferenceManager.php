<?php

namespace Icap\BibliographyBundle\Manager;

use Innova\AudioRecorderBundle\Entity\AudioRecorderConfiguration;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @DI\Service("icap.bibliography.manager")
 */
class BookReferenceManager
{
    protected $rm;
    protected $fileDir;
    protected $tempUploadDir;
    protected $tokenStorage;
    protected $claroUtils;
    protected $container;
    protected $workspaceManager;

    /**
     * @DI\InjectParams({
     *      "container"   = @DI\Inject("service_container"),
     * })
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function updateConfiguration(AudioRecorderConfiguration $config, $postData)
    {
        $om = $this->container->get('claroline.persistence.object_manager');

        $om->persist($config);
        $om->flush();
    }

    public function getConfig()
    {
        $config = $this->container->get('doctrine.orm.entity_manager')->getRepository('IcapBibliographyBundle:BookReferenceConfiguration')->findAll()[0];

        return $config;
    }
}
