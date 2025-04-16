'use server';
/**
 * @fileOverview Summarizes a recipe for a quick view, including key steps and ingredients.
 *
 * - summarizeRecipe - A function that summarizes a recipe.
 * - SummarizeRecipeInput - The input type for the summarizeRecipe function.
 * - SummarizeRecipeOutput - The return type for the summarizeRecipe function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeRecipeInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('A list of ingredients required for the recipe.'),
  instructions: z.string().describe('The instructions for preparing the recipe.'),
});
export type SummarizeRecipeInput = z.infer<typeof SummarizeRecipeInputSchema>;

const SummarizeRecipeOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the recipe, including key steps and ingredients.'),
});
export type SummarizeRecipeOutput = z.infer<typeof SummarizeRecipeOutputSchema>;

export async function summarizeRecipe(input: SummarizeRecipeInput): Promise<SummarizeRecipeOutput> {
  return summarizeRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRecipePrompt',
  input: {
    schema: z.object({
      recipeName: z.string().describe('The name of the recipe.'),
      ingredients: z.string().describe('A list of ingredients required for the recipe.'),
      instructions: z.string().describe('The instructions for preparing the recipe.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the recipe, including key steps and ingredients.'),
    }),
  },
  prompt: `You are an expert recipe summarizer. Your goal is to provide a concise summary of a recipe, including key steps and ingredients, so that the user can quickly assess if it suits their needs before viewing the full details.\n\nRecipe Name: {{{recipeName}}}\nIngredients: {{{ingredients}}}\nInstructions: {{{instructions}}}\n\nConcise Summary: `,
});

const summarizeRecipeFlow = ai.defineFlow<
  typeof SummarizeRecipeInputSchema,
  typeof SummarizeRecipeOutputSchema
>(
  {
    name: 'summarizeRecipeFlow',
    inputSchema: SummarizeRecipeInputSchema,
    outputSchema: SummarizeRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
