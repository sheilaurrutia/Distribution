<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2017/02/21 12:36:38
 */
class Version20170221123637 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE ujm_color (
                id INT AUTO_INCREMENT NOT NULL, 
                score DOUBLE PRECISION NOT NULL, 
                selection_id INT DEFAULT NULL, 
                INDEX IDX_AADB06B4E48EFE78 (selection_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            CREATE TABLE ujm_selection (
                id INT AUTO_INCREMENT NOT NULL, 
                interaction_qcm_id INT DEFAULT NULL, 
                begin INT NOT NULL, 
                end INT NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                score DOUBLE PRECISION NOT NULL, 
                feedback LONGTEXT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_C93913FFD17F50A6 (uuid), 
                INDEX IDX_C93913FF9DBF539 (interaction_qcm_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            CREATE TABLE ujm_selection_color (
                id INT AUTO_INCREMENT NOT NULL, 
                interaction_qcm_id INT DEFAULT NULL, 
                colorCode VARCHAR(255) NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                UNIQUE INDEX UNIQ_3CB7F80FD17F50A6 (uuid), 
                INDEX IDX_3CB7F80F9DBF539 (interaction_qcm_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            CREATE TABLE ujm_interaction_selection (
                id INT AUTO_INCREMENT NOT NULL, 
                question_id INT DEFAULT NULL, 
                htmlWithoutValue LONGTEXT NOT NULL, 
                mode VARCHAR(255) NOT NULL, 
                tries INT NOT NULL, 
                globalSuccessScore INT DEFAULT NULL, 
                globalFailureScore INT DEFAULT NULL, 
                penalty INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_7B1E8B31E27F6BF (question_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE ujm_selection 
            ADD CONSTRAINT FK_C93913FF9DBF539 FOREIGN KEY (interaction_qcm_id) 
            REFERENCES ujm_interaction_selection (id)
        ");
        $this->addSql("
            ALTER TABLE ujm_selection_color 
            ADD CONSTRAINT FK_3CB7F80F9DBF539 FOREIGN KEY (interaction_qcm_id) 
            REFERENCES ujm_interaction_selection (id)
        ");
        $this->addSql("
            ALTER TABLE ujm_interaction_selection 
            ADD CONSTRAINT FK_7B1E8B31E27F6BF FOREIGN KEY (question_id) 
            REFERENCES ujm_question (id)
        ");
        $this->addSql("
            ALTER TABLE ujm_hole 
            DROP position
        ");
        $this->addSql("
            ALTER TABLE ujm_interaction_hole 
            DROP originalText
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_selection 
            DROP FOREIGN KEY FK_C93913FF9DBF539
        ");
        $this->addSql("
            ALTER TABLE ujm_selection_color 
            DROP FOREIGN KEY FK_3CB7F80F9DBF539
        ");
        $this->addSql("
            DROP TABLE ujm_color
        ");
        $this->addSql("
            DROP TABLE ujm_selection
        ");
        $this->addSql("
            DROP TABLE ujm_selection_color
        ");
        $this->addSql("
            DROP TABLE ujm_interaction_selection
        ");
        $this->addSql("
            ALTER TABLE ujm_hole 
            ADD position INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_interaction_hole 
            ADD originalText TEXT DEFAULT NULL COLLATE utf8_unicode_ci
        ");
    }
}