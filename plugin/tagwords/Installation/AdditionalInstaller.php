<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 06/09/16
 * Time: 13:05
 */

namespace Icap\TagwordsBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller as BaseInstaller;

class AdditionalInstaller extends BaseInstaller
{
    public function postInstall()
    {
        $updater = new Updater\PopulationDictionnary();
        $updater->postInstall($this->container->get('doctrine.dbal.default_connection'), $this->container->get('kernel'));
    }
}