<?php

namespace Icap\BibliographyBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/03/02 04:39:30
 */
class Version20170302163926 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE icap__bibliography_book_reference (
                id INT AUTO_INCREMENT NOT NULL, 
                author VARCHAR(255) NOT NULL, 
                description LONGTEXT DEFAULT NULL, 
                abstract LONGTEXT DEFAULT NULL, 
                isbn VARCHAR(14) DEFAULT NULL, 
                publisher VARCHAR(255) DEFAULT NULL, 
                printer VARCHAR(255) DEFAULT NULL, 
                publicationYear INT DEFAULT NULL, 
                language VARCHAR(255) DEFAULT NULL, 
                pageCount INT DEFAULT NULL, 
                url VARCHAR(255) DEFAULT NULL, 
                coverUrl VARCHAR(255) DEFAULT NULL, 
                resourceNode_id INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_D961F495B87FAB32 (resourceNode_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE icap__bibliography_book_reference_configuration (
                id INT AUTO_INCREMENT NOT NULL, 
                new_window TINYINT(1) NOT NULL, 
                api_key VARCHAR(255) DEFAULT NULL, 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE icap__bibliography_book_reference 
            ADD CONSTRAINT FK_D961F495B87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            INSERT INTO icap__bibliography_book_reference_configuration (id, new_window)
            VALUES (NULL, 0);
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE icap__bibliography_book_reference
        ');
        $this->addSql('
            DROP TABLE icap__bibliography_book_reference_configuration
        ');
    }
}
