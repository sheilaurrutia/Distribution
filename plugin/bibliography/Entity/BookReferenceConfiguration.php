<?php

namespace Icap\BibliographyBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * BookReferenceConfiguration Entity.
 *
 * @ORM\Table(name="icap__bibliography_book_reference_configuration")
 * @ORM\Entity(repositoryClass="IcapBibliographyBundle\Repository\BookReferenceConfigurationRepository")
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
     * @ORM\Column(name="new_window", type="boolean", nullable=false)
     */
    protected $newWindow = false;

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
