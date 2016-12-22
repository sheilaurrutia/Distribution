<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 4/13/15
 */

namespace Icap\NotificationBundle\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;
use Icap\NotificationBundle\Entity\NotificationParameters;

class Updater090000 extends Updater
{
    private $om;
    private $connection;

    /**
     * @param $container
     */
    public function __construct($container)
    {
        $this->container = $container;
        $this->om = $container->get('claroline.persistence.object_manager');
    }

    public function postUpdate()
    {
        $this->updateNotificationsParametersTableName();
        $this->updateNotificatonParametersType();
    }

    private function updateNotificatonParametersType()
    {
        $notificationRepo = $this->om->getRepository('Icap\NotificationBundle\Entity\NotificationParameters');
        $parameters = $notificationRepo->findUserParameters();

        $this->om->startFlushSuite();
        $i = 0;

        $this->log('Updating configuration parameters...');

        foreach ($parameters as $parameter) {
            $parameter->setType(NotificationParameters::TYPR_USER);
            ++$i;
            if ($i % 100 === 0) {
                $this->om->forceFlush();
            }
        }

        $this->om->endFlushSuite();
    }

    public function updateNotificationsParametersTableName()
    {
    }
}
