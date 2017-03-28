<?php

namespace UJM\LtiBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2017/03/24 10:56:04
 */
class Version20170324105602 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE ujm_lti_resource (
                id INT AUTO_INCREMENT NOT NULL, 
                app_id INT NOT NULL, 
                INDEX IDX_43618A037987212D (app_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE ujm_lti_resource 
            ADD CONSTRAINT FK_43618A037987212D FOREIGN KEY (app_id) 
            REFERENCES ujm_lti_app (id)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE ujm_lti_resource
        ");
    }
}