<?php

namespace Icap\TagwordsBundle\Installation\Updater;

use AppKernel;
use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManager;


class populationDictionnary extends Updater
{
    public function postUpdate(Connection $connection, AppKernel $kernel)
    {
        // Delete portfolio badges tables if the BadgeBundle is not installed
        /** @var \Symfony\Component\HttpKernel\Bundle\Bundle[] $bundles */
        $bundles = $kernel->getBundles();
        $isTagwordsBundleInstalled = false;
        foreach ($bundles as $bundle) {
            if ('IcapTagwordsBundle' === $bundle->getName()) {
                $isTagwordsBundleInstalled = true;
            }
        }

        if (!$isTagwordsBundleInstalled && $connection->getSchemaManager()->tablesExist(['icap__motFr'])) {
            $sql = 'LOAD DATA INFILE \''.__DIR__.'../../lexique.csv\'
               INTO TABLE motFr
               FIELDS TERMINATED BY \',\'
               LINES TERMINATED BY \'\n\'
               IGNORE 1 ROWS;';
            $stmt = $this->connection->prepare($sql);
            $stmt = execute();
        }
    }
}