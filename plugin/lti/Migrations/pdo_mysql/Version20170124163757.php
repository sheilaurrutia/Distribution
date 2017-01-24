<?php

namespace UJM\LtiBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2017/01/24 04:37:59
 */
class Version20170124163757 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE ujm_lti_app (
                id INT AUTO_INCREMENT NOT NULL, 
                url LONGTEXT NOT NULL, 
                title VARCHAR(255) NOT NULL, 
                appkey LONGTEXT DEFAULT NULL, 
                secret LONGTEXT DEFAULT NULL, 
                description LONGTEXT DEFAULT NULL, 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            CREATE TABLE ujm_ltiapp_workspace (
                ltiapp_id INT NOT NULL, 
                workspace_id INT NOT NULL, 
                INDEX IDX_7FB6D142A22F70CC (ltiapp_id), 
                INDEX IDX_7FB6D14282D40A1F (workspace_id), 
                PRIMARY KEY(ltiapp_id, workspace_id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE ujm_ltiapp_workspace 
            ADD CONSTRAINT FK_7FB6D142A22F70CC FOREIGN KEY (ltiapp_id) 
            REFERENCES ujm_lti_app (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE ujm_ltiapp_workspace 
            ADD CONSTRAINT FK_7FB6D14282D40A1F FOREIGN KEY (workspace_id) 
            REFERENCES claro_workspace (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_ltiapp_workspace 
            DROP FOREIGN KEY FK_7FB6D142A22F70CC
        ");
        $this->addSql("
            DROP TABLE ujm_lti_app
        ");
        $this->addSql("
            DROP TABLE ujm_ltiapp_workspace
        ");
    }
}