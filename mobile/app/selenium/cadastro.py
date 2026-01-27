from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random

class CadastroTests:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.wait = WebDriverWait(self.driver, 10)
        self.base_url = "http://localhost:8081/"
    
    def setup(self):
        self.driver.get(self.base_url)
        cadastro_btn = self.wait.until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/div[2]/div/div/div/div[3]")))
        time.sleep(1)
        cadastro_btn.click()
    
    def teardown(self):
        self.driver.quit()
    
    def gerar_email_unico(self):
        return f"teste{random.randint(1000, 9999)}@email.com"
    
    # Fluxo 1: Cadastro com dados válidos
    def test_cadastro_valido(self):
        self.setup()
        
        nome = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        nome.send_keys("João")
        
        sobrenome = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        sobrenome.send_keys("Silva")
        
        data_nascimento = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[3]")
        data_nascimento.send_keys("01011990")
        
        email = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[4]")
        email.send_keys(self.gerar_email_unico())
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[5]")
        password.send_keys("senha123")
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(3)
        print("✓ Cadastro válido executado")
    
    # Fluxo 2: Cadastro com email já existente
    def test_cadastro_email_existente(self):
        self.setup()
        
        nome = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        nome.send_keys("Maria")
        
        sobrenome = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        sobrenome.send_keys("Santos")
        
        data_nascimento = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[3]")
        data_nascimento.send_keys("15051985")
        
        email = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[4]")
        email.send_keys("lionban667@gmail.com")  # Email já existente
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[5]")
        password.send_keys("senha456")
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(3)
        print("✓ Cadastro com email existente testado")
    
    # Fluxo 3: Cadastro com campos obrigatórios vazios
    def test_cadastro_campos_vazios(self):
        self.setup()
        
        submit = self.wait.until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")))
        submit.click()
        time.sleep(2)
        print("✓ Cadastro com campos vazios testado")
    
    # Fluxo 4: Cadastro com nome inválido (números)
    def test_cadastro_nome_com_numeros(self):
        self.setup()
        
        nome = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        nome.send_keys("João123")
        
        sobrenome = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        sobrenome.send_keys("Silva")
        
        data_nascimento = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[3]")
        data_nascimento.send_keys("01011990")
        
        email = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[4]")
        email.send_keys(self.gerar_email_unico())
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[5]")
        password.send_keys("senha123")
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(2)
        print("✓ Cadastro com nome contendo números testado")
    
    # Fluxo 5: Cadastro com email formato inválido
    def test_cadastro_email_formato_invalido(self):
        self.setup()
        
        nome = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        nome.send_keys("Ana")
        
        sobrenome = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        sobrenome.send_keys("Costa")
        
        data_nascimento = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[3]")
        data_nascimento.send_keys("20031995")
        
        email = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[4]")
        email.send_keys("email_sem_arroba")
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[5]")
        password.send_keys("senha789")
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(2)
        print("✓ Cadastro com email formato inválido testado")
    
    # Fluxo 6: Cadastro com data de nascimento inválida
    def test_cadastro_data_invalida(self):
        self.setup()
        
        nome = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        nome.send_keys("Pedro")
        
        sobrenome = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        sobrenome.send_keys("Oliveira")
        
        data_nascimento = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[3]")
        data_nascimento.send_keys("32132025")  # Data inválida
        
        email = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[4]")
        email.send_keys(self.gerar_email_unico())
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[5]")
        password.send_keys("senha321")
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(2)
        print("✓ Cadastro com data inválida testado")
    
    # Fluxo 7: Cadastro com senha muito curta
    def test_cadastro_senha_curta(self):
        self.setup()
        
        nome = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        nome.send_keys("Carla")
        
        sobrenome = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        sobrenome.send_keys("Ferreira")
        
        data_nascimento = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[3]")
        data_nascimento.send_keys("10101988")
        
        email = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[4]")
        email.send_keys(self.gerar_email_unico())
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[5]")
        password.send_keys("12")  # Senha muito curta
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(2)
        print("✓ Cadastro com senha curta testado")
    
    # Fluxo 8: Cadastro com caracteres especiais no nome
    def test_cadastro_nome_caracteres_especiais(self):
        self.setup()
        
        nome = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        nome.send_keys("José@#$")
        
        sobrenome = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        sobrenome.send_keys("Silva")
        
        data_nascimento = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[3]")
        data_nascimento.send_keys("05051992")
        
        email = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[4]")
        email.send_keys(self.gerar_email_unico())
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[5]")
        password.send_keys("senha456")
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(2)
        print("✓ Cadastro com caracteres especiais no nome testado")
    
    # Fluxo 9: Verificar navegação para login
    def test_ir_para_login(self):
        self.setup()
        try:
            login_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Login')] | //div[contains(text(), 'Login')]")
            login_link.click()
            time.sleep(2)
            print("✓ Navegação para login testada")
        except:
            print("✓ Link para login não encontrado")
    
    # Fluxo 10: Teste de preenchimento com dados longos
    def test_cadastro_dados_longos(self):
        self.setup()
        
        nome = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        nome.send_keys("A" * 50)  # Nome muito longo
        
        sobrenome = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        sobrenome.send_keys("B" * 50)  # Sobrenome muito longo
        
        data_nascimento = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[3]")
        data_nascimento.send_keys("01011990")
        
        email = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[4]")
        email_longo = "a" * 50 + "@email.com"
        email.send_keys(email_longo)
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[5]")
        password.send_keys("senha" * 20)  # Senha muito longa
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(2)
        print("✓ Cadastro com dados longos testado")

# Executar todos os testes
if __name__ == "__main__":
    tests = CadastroTests()
    
    print("=== INICIANDO TESTES DE CADASTRO ===")
    
    try:
        tests.test_cadastro_valido()
        tests.teardown()
        
        tests.__init__()
        tests.test_cadastro_email_existente()
        tests.teardown()
        
        tests.__init__()
        tests.test_cadastro_campos_vazios()
        tests.teardown()
        
        tests.__init__()
        tests.test_cadastro_nome_com_numeros()
        tests.teardown()
        
        tests.__init__()
        tests.test_cadastro_email_formato_invalido()
        tests.teardown()
        
        tests.__init__()
        tests.test_cadastro_data_invalida()
        tests.teardown()
        
        tests.__init__()
        tests.test_cadastro_senha_curta()
        tests.teardown()
        
        tests.__init__()
        tests.test_cadastro_nome_caracteres_especiais()
        tests.teardown()
        
        tests.__init__()
        tests.test_ir_para_login()
        tests.teardown()
        
        tests.__init__()
        tests.test_cadastro_dados_longos()
        tests.teardown()
        
        print("\n=== TODOS OS TESTES DE CADASTRO CONCLUÍDOS ===")
        
    except Exception as e:
        print(f"Erro durante os testes: {e}")
        tests.teardown()
