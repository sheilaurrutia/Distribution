<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\QuestionType\MatchQuestion;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.question_set")
 */
class SetQuestionSerializer implements SerializerInterface
{
    /**
     * Converts a Match question into a JSON-encodable structure.
     *
     * @param MatchQuestion $setQuestion
     * @param array         $options
     *
     * @return \stdClass
     */
    public function serialize($setQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $questionData->solutions = $this->serializeSolutions($setQuestion);
        }

        // Serializes score type
        $questionData->score = new \stdClass();
        $questionData->score->type = 'sum';

        return $questionData;
    }

    /**
     * Converts raw data into a Set question entity.
     *
     * @param \stdClass     $data
     * @param MatchQuestion $setQuestion
     * @param array         $options
     *
     * @return MatchQuestion
     */
    public function deserialize($data, $setQuestion = null, array $options = [])
    {
        if (empty($setQuestion)) {
            $setQuestion = new MatchQuestion();
        }

        // TODO: Implement deserialize() method.

        return $setQuestion;
    }

    private function serializeSolutions($questionType)
    {
    }
}