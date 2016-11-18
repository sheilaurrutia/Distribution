<?php

namespace Icap\NotificationBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/10/27 10:39:12
 */
class Version20161027103911 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE icap__notification_user_parameters 
            ADD phone_enabled_types LONGTEXT DEFAULT NULL COMMENT '(DC2Type:array)', 
            ADD mail_enabled_types LONGTEXT DEFAULT NULL COMMENT '(DC2Type:array)'
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE icap__notification_user_parameters 
            DROP phone_enabled_types, 
            DROP mail_enabled_types
        ");
    }
}