<?php

namespace UJM\ExoBundle\Library\Item\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;
use UJM\ExoBundle\Entity\Misc\Selection;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Item\ItemType;
use UJM\ExoBundle\Serializer\Item\Type\SelectionQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\SelectionAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Item\Type\SelectionQuestionValidator;

/**
 * Selection question definition.
 *
 * @DI\Service("ujm_exo.definition.question_selection")
 * @DI\Tag("ujm_exo.definition.item")
 */
class SelectionDefinition extends AbstractDefinition
{
    /**
     * @var SelectionQuestionValidator
     */
    private $validator;

    /**
     * @var SelectionAnswerValidator
     */
    private $answerValidator;

    /**
     * @var SelectionQuestionSerializer
     */
    private $serializer;

    /**
     * SelectionDefinition constructor.
     *
     * @param SelectionQuestionValidator  $validator
     * @param SelectionAnswerValidator    $answerValidator
     * @param SelectionQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.question_selection"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_selection"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.question_selection")
     * })
     */
    public function __construct(
        SelectionQuestionValidator $validator,
        SelectionAnswerValidator $answerValidator,
        SelectionQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the selection question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return ItemType::SELECTION;
    }

    /**
     * Gets the selection question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\ItemType\SelectionQuestion';
    }

    /**
     * Gets the selection question validator.
     *
     * @return SelectionQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the selection answer validator.
     *
     * @return SelectionAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the selection question serializer.
     *
     * @return SelectionQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * @param SelectionQuestion $question
     * @param array             $answer
     *
     * @return CorrectedAnswer
     */
    public function correctAnswer(AbstractItem $question, $answer)
    {
        $corrected = new CorrectedAnswer();

        if (!is_null($answer)) {
            switch ($question->getMode()) {
               case $question::MODE_FIND:
                  break;
               case $question::MODE_SELECT:
                  break;
               case $question::MODE_HIGHLIGHT:
                  break;
            }
        }

        return $corrected;
    }

    /**
     * @param SelectionQuestion $question
     *
     * @return array
     */
    public function expectAnswer(AbstractItem $question)
    {
        return;
    }

    /**
     * @param SelectionQuestion $selectionQuestion
     * @param array             $answersData
     *
     * @return array
     */
    public function getStatistics(AbstractItem $selectionQuestion, array $answersData)
    {
    }
}
