<?php

namespace Icap\BibliographyBundle\Entity;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\ORM\Mapping as ORM;

/**
 * Document.
 *
 * @ORM\Table(name="icap_bibliography_document")
 * @ORM\Entity
 */
class Document extends AbstractResource
{
    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $isbn;

    public function getIsbn()
    {
        return $this->isbn;
    }

    public function setIsbn($isbn)
    {
        $this->isbn = $isbn;
    }
}
