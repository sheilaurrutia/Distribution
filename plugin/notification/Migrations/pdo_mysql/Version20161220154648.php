<?php

namespace Icap\NotificationBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/12/20 03:46:49
 */
class Version20161220154648 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE icap__notification_user_parameters 
            ADD type INT NOT NULL, 
            DROP user_id
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE icap__notification_user_parameters 
            ADD user_id INT DEFAULT NULL, 
            DROP type
        ");
    }
}