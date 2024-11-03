import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface CustomElementCreatorProps {
  onSave: (elementName: string) => void;
}

export default function CustomElementCreator({ onSave }: CustomElementCreatorProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [elementName, setElementName] = useState('');

  const handleSave = () => {
    onSave(elementName);
    setElementName('');
    setIsFormVisible(false);
  };

  return (
    <div className="fixed right-4 top-4 z-50">
      {!isFormVisible ? (
        <Button onClick={() => setIsFormVisible(true)}>
          Создать свой Элемент
        </Button>
      ) : (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Создать свой Элемент</CardTitle>
            <CardDescription>
              Бесплатно элемент хранится неделю. Сохраните навсегда за 3$!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Название элемента</Label>
                <Input 
                  id="name" 
                  placeholder="Введите название" 
                  value={elementName}
                  onChange={(e) => setElementName(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsFormVisible(false)}>Отмена</Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </CardFooter>
        </Card>
      )}
      {isFormVisible && (
        <Card className="mt-4 w-[350px]">
          <CardHeader>
            <CardTitle>Сохранить навсегда</CardTitle>
            <CardDescription>
              Добавьте свой элемент в таблицу навечно!
            </CardDescription>
          </CardHeader>
          <CardContent>
            Всего за 3$ ваш элемент останется в таблице навсегда.
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Сохранить навсегда за 3$
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}