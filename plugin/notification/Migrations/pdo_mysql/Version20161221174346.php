<?php

namespace Icap\NotificationBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2016/12/21 05:43:47
 */
class Version20161221174346 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE icap__notification_user_parameters 
            ADD workspace_id INT DEFAULT NULL, 
            ADD user_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE icap__notification_user_parameters 
            ADD CONSTRAINT FK_F44A756D82D40A1F FOREIGN KEY (workspace_id) 
            REFERENCES claro_workspace (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            CREATE INDEX IDX_F44A756D82D40A1F ON icap__notification_user_parameters (workspace_id)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE icap__notification_user_parameters 
            DROP FOREIGN KEY FK_F44A756D82D40A1F
        ');
        $this->addSql('
            DROP INDEX IDX_F44A756D82D40A1F ON icap__notification_user_parameters
        ');
        $this->addSql('
            ALTER TABLE icap__notification_user_parameters 
            DROP workspace_id, 
            DROP user_id
        ');
    }
}
