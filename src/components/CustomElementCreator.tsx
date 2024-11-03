import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { XIcon, LoaderIcon } from "@/components/ui/icons"
import { toast } from 'react-toastify';

interface CustomElementCreatorProps {
  onSave: (elementName: string) => void;
  onNotify: (message: string, type: 'success' | 'error') => void;
}

interface ErrorResponse {
  error: string;
  code: string;
  field?: string;
}

export default function CustomElementCreator({ onSave, onNotify }: CustomElementCreatorProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [elementName, setElementName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [elementData, setElementData] = useState({
    name: '',
    symbol: '',
    atomicNumber: 0,
    atomicMass: 0,
  });

  const API_BASE = import.meta.env.PROD ? '/mongoose-app/api' : '/api';

  const handleSave = async () => {
    if (!elementName.trim()) {
      onNotify('Упс! Кажется, вы забыли назвать свой элемент. Давайте придумаем ему имя!', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const payload = { 
        name: elementName,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      console.log('Sending request to API:', {
        url: `${API_BASE}/elements`,
        method: 'POST',
        payload
      });

      const response = await fetch(`${API_BASE}/elements`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        onSave(elementName);
        onNotify(`Ура! Ваш элемент "${elementName}" теперь часть нашей таблицы на целую неделю!`, 'success');
        setElementName('');
        setTimeout(() => setIsFormVisible(false), 3000);
      } else {
        throw new Error(data.error || data.detail || 'Failed to create element');
      }
    } catch (error) {
      console.error('Error:', error);
      onNotify('Ой! Что-то пошло не так. Может, попробуем еще раз?', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePayment = async () => {
    setIsPaymentProcessing(true);
    try {
      const response = await fetch('/api/elements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: elementName,
          isPermanent: true
        }),
      });

      if (response.ok) {
        onNotify('Вау! Ваш элемент теперь навечно в нашем сердце ❤️‍🔥', 'success');
        setTimeout(() => {
          setIsPaymentVisible(false);
          setIsFormVisible(false);
        }, 3000);
      }
    } catch (error) {
      onNotify('Произошла ошибка при обработке платежа', 'error');
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleClose = () => {
    setIsFormVisible(false);
    setIsPaymentVisible(false);
    setElementName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCVC('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/mongoose-app/api/elements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(elementData),
      });

      const data = await response.json() as ErrorResponse;
      console.log('Response:', data);

      if (response.status === 400 && data.code === 'DUPLICATE_ELEMENT') {
        toast.warning('Такой элемент уже существует в таблице!');
        return;
      }

      if (!response.ok) {
        throw new Error('Ошибка при добавлении элемента');
      }

      setElementData({
        name: '',
        symbol: '',
        atomicNumber: 0,
        atomicMass: 0,
      });
      toast.success('Элемент успешно добавлен!');
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Произошла ошибка при добавлении элемента');
    }
  };

  return (
    <div className="form-container">
      {!isFormVisible ? (
        <Button 
          onClick={() => setIsFormVisible(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600
                     transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <span className="mr-2">✨</span> Создать свой элемент
        </Button>
      ) : (
        <>
          <Card className="w-[300px] bg-opacity-95 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-50" />
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 z-20 rounded-full bg-white shadow-md 
                         hover:bg-gray-100 transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Создайте свой элемент!
              </CardTitle>
              <CardDescription className="text-sm">
                Бесплатно на 7 дней или навсегда в своем сердце❤️‍
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3 relative z-10">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Название вашего элемента</Label>
                <Input 
                  id="name" 
                  placeholder="Например: Фантазиум" 
                  value={elementName}
                  onChange={(e) => setElementName(e.target.value)}
                  className="h-10 text-sm border-2 border-blue-200 focus:border-blue-400 transition-colors"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 relative z-10">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className={`text-sm h-10 w-full transition-all duration-300 transform
                           ${isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'}
                           bg-gradient-to-r from-purple-500 to-pink-500 
                           hover:from-purple-600 hover:to-pink-600 shadow-md`}
              >
                {isSaving ? <LoaderIcon className="mr-2 h-4 w-4" /> : '💾'} Сохранить на 7 дней
              </Button>
            </CardFooter>
          </Card>

          <Button 
            className={`mt-2 w-full h-10 text-sm transition-all duration-300
                       ${isPaymentProcessing ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105 animate-pulse'}
                       bg-gradient-to-r from-red-500 to-pink-500 
                       hover:from-red-600 hover:to-pink-600 shadow-lg`}
            onClick={() => !isPaymentProcessing && setIsPaymentVisible(true)}
            disabled={isPaymentProcessing}
          >
            <span className="relative z-10 flex items-center">
              <span className="mr-2">❤️‍🔥</span> Оплатить 3$
            </span>
          </Button>

          {isPaymentVisible && (
            <div className="fixed bottom-4 right-4 w-[300px] transform transition-all duration-300">
              <Card className="bg-white shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 opacity-50" />
                <Button
                  onClick={() => setIsPaymentVisible(false)}
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Закрыть</span>
                </Button>
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-lg flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    <span>❤️‍🔥</span>
                    <span>Элемент навечно в сердце таблицы</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pb-2 relative z-10">
                  <Input 
                    placeholder="Номер карты"
                    className="h-10 text-sm border-2 border-pink-200 focus:border-pink-400 transition-colors"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input 
                      placeholder="MM/YY"
                      className="h-10 text-sm w-1/2 border-2 border-pink-200 focus:border-pink-400 transition-colors"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                    <Input 
                      placeholder="CVC"
                      className="h-10 text-sm w-1/2 border-2 border-pink-200 focus:border-pink-400 transition-colors"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-0 relative z-10">
                  <Button 
                    className="w-full h-10 text-sm bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600
                               transition-all duration-300 transform hover:scale-105 shadow-md"
                    onClick={handlePayment}
                    disabled={isPaymentProcessing}
                  >
                    {isPaymentProcessing ? <LoaderIcon className="mr-2 h-4 w-4" /> : '💖'} Оплатить 3$
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </>
      )}

      <div className="notification-container">
        {notification && (
          <div className={`px-4 py-2 rounded-md shadow-lg text-white
            ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
}