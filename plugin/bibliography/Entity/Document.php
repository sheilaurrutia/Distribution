<?php

namespace Innova\AudioRecorderBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Document.
 *
 * @ORM\Table(name="icap_bibliography_document")
 * @ORM\Entity
 */
class Document
{
    /**
     * @var int
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;
}
