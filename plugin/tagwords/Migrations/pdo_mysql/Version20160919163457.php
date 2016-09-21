<?php

namespace Icap\TagwordsBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2016/09/19 04:35:02
 */
class Version20160919163457 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE icap_tagwords_french (
                id INT AUTO_INCREMENT NOT NULL, 
                tagwordsFrench VARCHAR(255) NOT NULL, 
                ratio DOUBLE PRECISION NOT NULL, 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE icap_tagwords_english (
                id INT AUTO_INCREMENT NOT NULL, 
                tagwordsEnglish VARCHAR(255) NOT NULL, 
                ratio DOUBLE PRECISION NOT NULL, 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE icap_tagwords_french
        ');
        $this->addSql('
            DROP TABLE icap_tagwords_english
        ');
    }
}
