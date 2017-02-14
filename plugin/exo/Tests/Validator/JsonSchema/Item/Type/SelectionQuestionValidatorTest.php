<?php

namespace UJM\ExoBundle\Tests\Validator\JsonSchema\Item\Type;

use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Testing\Json\JsonSchemaTestCase;
use UJM\ExoBundle\Validator\JsonSchema\Item\Type\SelectionQuestionValidator;

class SelectionQuestionValidatorTest extends JsonSchemaTestCase
{
    /**
     * @var SelectionQuestionValidator
     */
    private $validator;

    protected function setUp()
    {
        parent::setUp();
    }

    /**
     * The validator MUST return an error if there is not the same number of solutions and holes.
     */
    public function testInvalidNumberOfSolutionsThrowsError()
    {
    }

    /**
     * The validator MUST execute validation for its keywords when `solutionRequired`.
     */
    public function testSolutionKeywordsAreValidatedToo()
    {
    }
}
