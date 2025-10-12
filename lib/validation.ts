import { AnswerValidation } from './hunt-config';

export function validateAnswer(userAnswer: string, validation: AnswerValidation): boolean {
  const trimmedAnswer = userAnswer.trim();

  switch (validation.type) {
    case 'number_exact':
      const numAnswer = parseInt(trimmedAnswer, 10);
      return !isNaN(numAnswer) && numAnswer === validation.value;

    case 'text_exact_ci':
      return trimmedAnswer.toLowerCase() === validation.value?.toString().toLowerCase();

    case 'text_any_of':
      if (!validation.valuesCI) return false;
      const lowerAnswer = trimmedAnswer.toLowerCase();
      return validation.valuesCI.some(val => val.toLowerCase() === lowerAnswer);

    case 'text_any_of_multi':
      if (!validation.valuesCI || !validation.minMatches) return false;
      const lowerAnswerMulti = trimmedAnswer.toLowerCase();
      // Split by comma and trim each part
      const submittedValues = lowerAnswerMulti.split(',').map(v => v.trim());
      // Count how many of the submitted values match the valid options
      const matchCount = submittedValues.filter(submitted =>
        validation.valuesCI!.some(valid => valid.toLowerCase() === submitted)
      ).length;
      return matchCount >= validation.minMatches;

    case 'text_min_len':
      // Count words for this type
      const words = trimmedAnswer.split(/\s+/).filter(w => w.length > 0);
      return validation.min ? words.length >= validation.min : false;

    default:
      return false;
  }
}

