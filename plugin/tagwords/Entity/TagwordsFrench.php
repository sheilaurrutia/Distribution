<?php

namespace Icap\TagwordsBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="Icap\TagwordsBundle\Repository\TagwordsRepository")
 * @ORM\Table(name="icap_tagwords_french")
 */
class TagwordsFrench
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    private $tagwordsFrench;

    /**
     * @ORM\Column(type="float")
     */
    private $ratio;

    /**
     * @return mixed
     */
    public function getRatio()
    {
        return $this->ratio;
    }

    /**
     * @param mixed $ratio
     */
    public function setRatio($ratio)
    {
        $this->ratio = $ratio;
    }

    /**
     * @return mixed
     */
    public function getTagwordsFrench()
    {
        return $this->tagwordsFrench;
    }

    /**
     * @param mixed $french_tagwords
     */
    public function setTagwordsFrench($tagwordsFrench)
    {
        $this->tagwordsFrench = $tagwordsFrench;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    public function serialize()
    {
        return [
            'id' => $this->id,
            'tagwords' => $this->tagwordsFrench,
            'ratio' => $this->ratio,
        ];
    }
}
