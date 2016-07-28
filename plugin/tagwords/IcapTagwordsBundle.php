<?php

namespace Icap\TagwordsBundle;

use Claroline\CoreBundle\Library\PluginBundle;
use Claroline\KernelBundle\Bundle\ConfigurationBuilder;

/**
 * Bundle class.
 */
class IcapTagwordsBundle extends PluginBundle 
{
    public function getConfiguration($environment)
    {
        $config = new ConfigurationBuilder();

        return $config;
    }

    public function hasMigrations()
    {
        return false;
    }
}