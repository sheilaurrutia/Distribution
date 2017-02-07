<?php

namespace Icap\BibliographyBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * BookReferenceConfiguration Entity.
 *
 * @ORM\Table(name="innova_audio_recorder_configuration")
 * @ORM\Entity
 */
class BookReferenceConfiguration
{
    /**
     * @var int
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var bool
     * @ORM\Column(name="new_window", type="boolean", nullable=false, default=false)
     */
    protected $newWindow;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getNewWindow()
    {
        return $this->newWindow;
    }

    public function setNewWindow($newWindow)
    {
        $this->newWindow = $newWindow;
    }
}
