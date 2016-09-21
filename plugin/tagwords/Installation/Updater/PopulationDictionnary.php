<?php

namespace Icap\TagwordsBundle\Installation\Updater;

use AppKernel;
use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Connection;

class PopulationDictionnary extends Updater
{
    public function postInstall(Connection $connection, AppKernel $kernel)
    {

        /** @var \Symfony\Component\HttpKernel\Bundle\Bundle[] $bundles */
        $bundles = $kernel->getBundles();
        $isTagwordsBundleInstalled = false;
        foreach ($bundles as $bundle) {
            if ('IcapTagwordsBundle' === $bundle->getName()) {
                $isTagwordsBundleInstalled = true;
            }
        }

        if ($isTagwordsBundleInstalled && $connection->getSchemaManager()->tablesExist(['icap_tagwords_french'])) {
            $sql = 'LOAD DATA INFILE \''.__DIR__.'../../../tagwordsFrench.csv\'
               INTO TABLE icap_tagwords_french
               FIELDS TERMINATED BY \',\'
               LINES TERMINATED BY \'\n\'
               IGNORE 1 ROWS;';
            $connection->exec($sql);
        }

        if ($isTagwordsBundleInstalled && $connection->getSchemaManager()->tablesExist(['icap_tagwords_english'])) {
            $sql = 'LOAD DATA INFILE \''.__DIR__.'../../../tagwordsEnglish.csv\'
               INTO TABLE icap_tagwords_english
               FIELDS TERMINATED BY \';\'
               LINES TERMINATED BY \'\n\'
               ';
            $connection->exec($sql);
        }
    }
}
