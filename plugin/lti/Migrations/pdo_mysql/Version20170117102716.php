<?php

namespace UJM\LtiBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/01/17 10:27:18
 */
class Version20170117102716 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE ujm_lti_app (
                id INT AUTO_INCREMENT NOT NULL, 
                url LONGTEXT NOT NULL, 
                key LONGTEXT NOT NULL, 
                secret LONGTEXT NOT NULL, 
                description LONGTEXT NOT NULL, 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE ujm_lti_app
        ');
    }
}
