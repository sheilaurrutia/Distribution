<?php

namespace Claroline\ClacoFormBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/03/29 03:33:42
 */
class Version20170329153340 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_clacoformbundle_entry_notification (
                id INT AUTO_INCREMENT NOT NULL, 
                entry_id INT DEFAULT NULL, 
                user_id INT DEFAULT NULL, 
                details LONGTEXT DEFAULT NULL COMMENT '(DC2Type:json_array)', 
                INDEX IDX_1D094190BA364942 (entry_id), 
                INDEX IDX_1D094190A76ED395 (user_id), 
                UNIQUE INDEX clacoform_notification_unique_entry_user (entry_id, user_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql('
            ALTER TABLE claro_clacoformbundle_entry_notification 
            ADD CONSTRAINT FK_1D094190BA364942 FOREIGN KEY (entry_id) 
            REFERENCES claro_clacoformbundle_entry (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_clacoformbundle_entry_notification 
            ADD CONSTRAINT FK_1D094190A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ');
        $this->addSql("
            ALTER TABLE claro_clacoformbundle_field 
            ADD locked TINYINT(1) DEFAULT '0' NOT NULL, 
            ADD locked_edition TINYINT(1) DEFAULT '0' NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE claro_clacoformbundle_entry_notification
        ');
        $this->addSql('
            ALTER TABLE claro_clacoformbundle_field 
            DROP locked, 
            DROP locked_edition
        ');
    }
}
