#!/usr/bin/env python3
"""
Script para executar todos os testes Selenium do QuizDev
Executa 20 fluxos de teste: 10 para Login e 10 para Cadastro
"""

import subprocess
import sys
import time

def run_test_file(file_name):
    """Executa um arquivo de teste específico"""
    print(f"\n{'='*60}")
    print(f"EXECUTANDO: {file_name}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run([sys.executable, file_name], 
                              capture_output=True, 
                              text=True, 
                              timeout=300)  # 5 minutos timeout
        
        print(result.stdout)
        if result.stderr:
            print(f"ERROS: {result.stderr}")
        
        return result.returncode == 0
    
    except subprocess.TimeoutExpired:
        print(f"TIMEOUT: {file_name} demorou mais de 5 minutos")
        return False
    except Exception as e:
        print(f"ERRO ao executar {file_name}: {e}")
        return False

def main():
    """Função principal que executa todos os testes"""
    print("🚀 INICIANDO BATERIA COMPLETA DE TESTES SELENIUM - QUIZDEV")
    print("📋 Total de fluxos: 20 (10 Login + 10 Cadastro)")
    print(f"⏰ Início: {time.strftime('%H:%M:%S')}")
    
    # Lista de arquivos de teste
    test_files = [
        "login.py",
        "cadastro.py"
    ]
    
    results = {}
    start_time = time.time()
    
    # Executar cada arquivo de teste
    for test_file in test_files:
        print(f"\n⏳ Preparando para executar {test_file}...")
        time.sleep(2)  # Pausa entre testes
        
        success = run_test_file(test_file)
        results[test_file] = success
        
        if success:
            print(f"✅ {test_file} - SUCESSO")
        else:
            print(f"❌ {test_file} - FALHOU")
    
    # Relatório final
    end_time = time.time()
    duration = end_time - start_time
    
    print(f"\n{'='*60}")
    print("📊 RELATÓRIO FINAL DOS TESTES")
    print(f"{'='*60}")
    print(f"⏱️  Tempo total: {duration:.2f} segundos")
    print(f"📁 Arquivos testados: {len(test_files)}")
    
    successful_tests = sum(1 for success in results.values() if success)
    failed_tests = len(results) - successful_tests
    
    print(f"✅ Sucessos: {successful_tests}")
    print(f"❌ Falhas: {failed_tests}")
    
    print(f"\n📋 DETALHES POR ARQUIVO:")
    for test_file, success in results.items():
        status = "✅ PASSOU" if success else "❌ FALHOU"
        print(f"   {test_file}: {status}")
    
    # Resumo dos fluxos testados
    print(f"\n🎯 FLUXOS TESTADOS (20 total):")
    print("   LOGIN (10 fluxos):")
    print("   1. Login válido")
    print("   2. Email inválido") 
    print("   3. Senha incorreta")
    print("   4. Campos vazios")
    print("   5. Email formato inválido")
    print("   6. Senha muito curta")
    print("   7. Link 'Esqueci senha'")
    print("   8. Navegação para cadastro")
    print("   9. Múltiplas tentativas")
    print("   10. Responsividade dos campos")
    
    print("   CADASTRO (10 fluxos):")
    print("   1. Cadastro válido")
    print("   2. Email já existente")
    print("   3. Campos vazios")
    print("   4. Nome com números")
    print("   5. Email formato inválido")
    print("   6. Data inválida")
    print("   7. Senha muito curta")
    print("   8. Nome com caracteres especiais")
    print("   9. Navegação para login")
    print("   10. Dados muito longos")
    
    if failed_tests == 0:
        print(f"\n🎉 TODOS OS TESTES PASSARAM! QuizDev está funcionando perfeitamente.")
    else:
        print(f"\n⚠️  {failed_tests} arquivo(s) falharam. Verifique os logs acima.")
    
    print(f"🏁 Fim: {time.strftime('%H:%M:%S')}")
    
    return failed_tests == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)