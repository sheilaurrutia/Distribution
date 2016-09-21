<?php

namespace Icap\TagwordsBundle;

use Claroline\CoreBundle\Library\PluginBundle;
use Claroline\KernelBundle\Bundle\ConfigurationBuilder;
use Icap\TagwordsBundle\Installation\AdditionalInstaller;

/**
 * Bundle class.
 */
class IcapTagwordsBundle extends PluginBundle 
{
    public function getConfiguration($environment)
    {
        $config = new ConfigurationBuilder();

        return $config->addRoutingResource(__DIR__ . '/Resources/config/routing.yml', null, 'tagwords');
    }

    public function hasMigrations()
    {
        return true;
    }
    public function getAdditionalInstaller()
    {
        return new AdditionalInstaller();
    }
}