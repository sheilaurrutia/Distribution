<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 06/09/16
 * Time: 13:05
 */

namespace Icap\TagwordsBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller as BaseInstaller;

class AdditionallInstaller extends BaseInstaller
{
    public function postInstall()
    {
        $updater = new Updater\MigrationUpdater();
        $updater->setLogger($this->logger);
        $updater->postInstall($this->container->get('doctrine.orm'), $this->container->get(''));
    }


}