'use server';
/**
 * @fileOverview Generates recipes based on a list of ingredients provided by the user, using only those ingredients.
 *
 * - generateRecipes - A function that handles the recipe generation process.
 * - GenerateRecipesInput - The input type for the generateRecipes function.
 * - GenerateRecipesOutput - The return type for the generateRecipes function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateRecipesInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients the user has available.'),
});
export type GenerateRecipesInput = z.infer<typeof GenerateRecipesInputSchema>;

const GenerateRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      description: z.string().describe('A short description of the recipe.'),
      ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
      instructions: z.string().describe('The instructions to make the recipe.'),
    })
  ).describe('A list of recipes that can be made with the given ingredients.'),
});
export type GenerateRecipesOutput = z.infer<typeof GenerateRecipesOutputSchema>;

export async function generateRecipes(input: GenerateRecipesInput): Promise<GenerateRecipesOutput> {
  return generateRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipesPrompt',
  input: {
    schema: z.object({
      ingredients: z.string().describe('A comma-separated list of ingredients the user has available.'),
    }),
  },
  output: {
    schema: z.object({
      recipes: z.array(
        z.object({
          name: z.string().describe('The name of the recipe.'),
          description: z.string().describe('A short description of the recipe.'),
          ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
          instructions: z.string().describe('The instructions to make the recipe.'),
        })
      ).describe('A list of recipes that can be made with the given ingredients.'),
    }),
  },
  prompt: `You are a recipe generation expert. You take a list of ingredients and generate recipes that can be made with them. You MUST ONLY use the ingredients provided.

  Ingredients: {{{ingredients}}}

  Generate a list of recipes that can be made with the given ingredients. Include the name, a short description, a list of ingredients, and instructions for each recipe. Be creative!
  `,
});

const generateRecipesFlow = ai.defineFlow<
  typeof GenerateRecipesInputSchema,
  typeof GenerateRecipesOutputSchema
>(
  {
    name: 'generateRecipesFlow',
    inputSchema: GenerateRecipesInputSchema,
    outputSchema: GenerateRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
