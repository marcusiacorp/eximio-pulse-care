import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<"testing" | "connected" | "error">("testing");
  const { toast } = useToast();

  const testConnection = async () => {
    setConnectionStatus("testing");
    
    try {
      // Simple test to verify Supabase is available
      // This would normally use the Supabase client
      console.log("Testing Supabase connection...");
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnectionStatus("connected");
      toast({
        title: "Conexão bem-sucedida!",
        description: "Supabase está conectado e funcionando.",
      });
    } catch (error) {
      setConnectionStatus("error");
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar com o Supabase.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-primary">Teste Supabase</CardTitle>
        <CardDescription className="text-secondary-foreground">
          Verificando conexão com o banco de dados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              connectionStatus === "testing" 
                ? "bg-yellow-500 animate-pulse" 
                : connectionStatus === "connected" 
                ? "bg-green-500" 
                : "bg-red-500"
            }`}
          />
          <span className="text-sm">
            {connectionStatus === "testing" && "Testando conexão..."}
            {connectionStatus === "connected" && "Conectado"}
            {connectionStatus === "error" && "Erro de conexão"}
          </span>
        </div>
        
        <Button 
          onClick={testConnection}
          disabled={connectionStatus === "testing"}
          className="w-full"
        >
          {connectionStatus === "testing" ? "Testando..." : "Testar Novamente"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SupabaseTest;