<?php

namespace Icap\TagwordsBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Icap\TagwordsBundle\Entity\TagwordsEnglish;
use Icap\TagwordsBundle\Entity\TagwordsFrench;

class TagwordsRepository extends EntityRepository
{
    /**
     * @return icap_tagwords_french[]
     */
    public function Tagwords_french($b) // Query for the database with the word
    {
        return $this->createQueryBuilder('icap_tagwords_french')
            ->select('icap_tagwords_french')
            ->where('icap_tagwords_french.tagwordsFrench IN (:mots)')
            ->setParameter('mots', $b, \Doctrine\DBAL\Connection::PARAM_STR_ARRAY)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return icap_tagwords_english[]
     */
    public function Tagwords_english($b) // Query for the database with the word
    {
        return $this->createQueryBuilder('icap_tagwords_english')
            ->select('icap_tagwords_english')
            ->where('icap_tagwords_english.tagwordsEnglish IN (:mots)')
            ->setParameter('mots', $b, \Doctrine\DBAL\Connection::PARAM_STR_ARRAY)
            ->getQuery()
            ->getResult();
    }
}
