'use client';

import {generateRecipes} from '@/ai/flows/generate-recipes';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {useEffect, useState} from 'react';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<
    {
      name: string;
      description: string;
      ingredients: string[];
      instructions: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (ingredients) {
      setIsLoading(true);
      generateRecipes({ingredients})
        .then(result => {
          setRecipes(result.recipes);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [ingredients]);

  const handleGenerateRecipes = () => {
    if (ingredients) {
      setIngredients(ingredients);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-secondary">
      <h1 className="text-3xl font-bold mb-4 text-primary">FridgeChef</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Enter ingredients (e.g., chicken, rice, vegetables)"
          className="w-96 rounded-md shadow-sm focus:ring-accent focus:border-accent"
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
        />
        <Button onClick={handleGenerateRecipes} className="mt-2 bg-primary text-primary-foreground hover:bg-primary/80">
          {isLoading ? 'Generating...' : 'Generate Recipes'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <Card key={index} className="bg-card text-card-foreground shadow-md rounded-lg overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold">{recipe.name}</CardTitle>
              <CardDescription>{recipe.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="text-md font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc pl-5">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
              <h3 className="text-md font-semibold mt-2">Instructions:</h3>
              <p>{recipe.instructions}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
