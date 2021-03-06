<?php
/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\CoreBundle\Entity\Resource\ResourceIcon;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ResourceIconsUpdater extends Updater
{
    private $container;
    private $om;
    private $repo;
    private $iconManager;
    private $iconSetManager;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->om = $this->container->get('claroline.persistence.object_manager');
        $this->repo = $this->om->getRepository('Claroline\CoreBundle\Entity\Resource\ResourceIcon');
        $this->iconManager = $this->container->get('claroline.manager.icon_manager');
        $this->iconSetManager = $this->container->get('claroline.manager.icon_set_manager');
    }

    public function postUpdate()
    {
        $this->updateIcons();
    }

    private function updateIcons()
    {
        $this->log('Refreshing mime types icons...');
        $this->container->get('claroline.manager.icon_manager')->setLogger($this->logger);
        $coreIconWebDirRelativePath = 'bundles/clarolinecore/images/resources/icons/';

        $resourceImages = $this->container->get('claroline.manager.icon_manager')->getDefaultIconMap();
        $this->om->startFlushSuite();

        foreach ($resourceImages as $resourceImage) {
            $mimeType = $resourceImage[1];
            $rimg = $this->repo->findOneBy(['mimeType' => $mimeType, 'isShortcut' => false]);
            $relativeUrl = $coreIconWebDirRelativePath.$resourceImage[0];
            if ($rimg === null) {
                $this->log('Adding mime type for '.$mimeType.'.');
                $rimg = new ResourceIcon();
                $rimg->setMimeType($mimeType);
                $rimg->setShortcut(false);
                $rimg->setRelativeUrl($relativeUrl);
                $this->om->persist($rimg);
                $this->container->get('claroline.manager.icon_manager')->createShortcutIcon($rimg);
            }
            // Also add/update the resource type icon to default resource icon set
            $this->iconSetManager->addOrUpdateIconItemToDefaultResourceIconSet(
                $rimg,
                $relativeUrl
            );
        }

        $this->om->endFlushSuite();
        $baseIcons = $this->repo->findBaseIcons();
        $this->om->startFlushSuite();

        foreach ($baseIcons as $icon) {
            $this->log('Refreshing '.$icon->getMimeType().'...');
            $this->iconManager->refresh($icon);
        }

        $this->om->endFlushSuite();
        $this->om->forceFlush();
    }
}
