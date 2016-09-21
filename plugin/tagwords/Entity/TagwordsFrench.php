<?php


namespace Icap\TagwordsBundle\Entity;

use Icap\TagwordsBundle\Repository\TagwordsRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="Icap\TagwordsBundle\Repository\TagwordsRepository")
 * @ORM\Table(name="french_tagwords")
 */
class french_tagwords
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
    private $french_tagwords;

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
    public function getFrenchTagwords()
    {
        return $this->french_tagwords;
    }

    /**
     * @param mixed $french_tagwords
     */
    public function setFrenchTagwords($french_tagwords)
    {
        $this->french_tagwords = $french_tagwords;
    }
    


    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }
    
    public function serialize() //permet de changer le nom des collones de la requete pour le Lexique
    {
        return array(
            'id' => $this->id,
            '$french_tagwords' => $this->french_tagwords,
            //'valeur' => $this->valeur,
            'ratio' => $this->ratio
        );
    }
}