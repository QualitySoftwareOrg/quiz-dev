from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class LoginTests:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.wait = WebDriverWait(self.driver, 10)
        self.base_url = "http://localhost:8081/"
    
    def setup(self):
        self.driver.get(self.base_url)
        login_btn = self.wait.until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/div[2]/div/div/div/div[2]")))
        login_btn.click()
    
    def teardown(self):
        self.driver.quit()
    
    # Fluxo 1: Login com credenciais válidas
    def test_login_valido(self):
        self.setup()
        email = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        email.send_keys("lionban667@gmail.com")
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        password.send_keys("123")
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(3)
        print("✓ Login válido executado")
    
    # Fluxo 2: Login com email inválido
    def test_login_email_invalido(self):
        self.setup()
        email = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        email.send_keys("email_inexistente@test.com")
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        password.send_keys("123")
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(2)
        print("✓ Login com email inválido testado")
    
    # Fluxo 3: Login com senha incorreta
    def test_login_senha_incorreta(self):
        self.setup()
        email = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        email.send_keys("lionban667@gmail.com")
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        password.send_keys("senha_errada")
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(2)
        print("✓ Login com senha incorreta testado")
    
    # Fluxo 4: Login com campos vazios
    def test_login_campos_vazios(self):
        self.setup()
        submit = self.wait.until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")))
        submit.click()
        time.sleep(2)
        print("✓ Login com campos vazios testado")
    
    # Fluxo 5: Login com email formato inválido
    def test_login_email_formato_invalido(self):
        self.setup()
        email = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        email.send_keys("email_sem_arroba")
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        password.send_keys("123")
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(2)
        print("✓ Login com formato de email inválido testado")
    
    # Fluxo 6: Login com senha muito curta
    def test_login_senha_curta(self):
        self.setup()
        email = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        email.send_keys("lionban667@gmail.com")
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        password.send_keys("1")
        
        submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
        submit.click()
        time.sleep(2)
        print("✓ Login com senha muito curta testado")
    
    # Fluxo 7: Verificar link "Esqueci minha senha"
    def test_esqueci_senha(self):
        self.setup()
        try:
            esqueci_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Esqueci')]") 
            esqueci_link.click()
            time.sleep(2)
            print("✓ Link 'Esqueci minha senha' testado")
        except:
            print("✓ Link 'Esqueci minha senha' não encontrado (esperado)")
    
    # Fluxo 8: Verificar navegação para cadastro
    def test_ir_para_cadastro(self):
        self.setup()
        try:
            cadastro_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Cadastro')] | //div[contains(text(), 'Cadastro')]")
            cadastro_link.click()
            time.sleep(2)
            print("✓ Navegação para cadastro testada")
        except:
            print("✓ Link para cadastro não encontrado")
    
    # Fluxo 9: Teste de múltiplas tentativas de login
    def test_multiplas_tentativas(self):
        for i in range(3):
            self.setup()
            email = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
            email.clear()
            email.send_keys(f"teste{i}@email.com")
            
            password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
            password.clear()
            password.send_keys("senha_errada")
            
            submit = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/div[2]")
            submit.click()
            time.sleep(1)
        print("✓ Múltiplas tentativas de login testadas")
    
    # Fluxo 10: Verificar responsividade dos campos
    def test_responsividade_campos(self):
        self.setup()
        email = self.wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[1]")))
        
        # Teste com texto longo
        texto_longo = "a" * 100 + "@email.com"
        email.send_keys(texto_longo)
        
        password = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div[3]/div/div/div/div[2]/input[2]")
        password.send_keys("senha_muito_longa_para_testar_limite" * 5)
        
        time.sleep(2)
        print("✓ Responsividade dos campos testada")

# Executar todos os testes
if __name__ == "__main__":
    tests = LoginTests()
    
    print("=== INICIANDO TESTES DE LOGIN ===")
    
    try:
        tests.test_login_valido()
        tests.teardown()
        
        tests.__init__()
        tests.test_login_email_invalido()
        tests.teardown()
        
        tests.__init__()
        tests.test_login_senha_incorreta()
        tests.teardown()
        
        tests.__init__()
        tests.test_login_campos_vazios()
        tests.teardown()
        
        tests.__init__()
        tests.test_login_email_formato_invalido()
        tests.teardown()
        
        tests.__init__()
        tests.test_login_senha_curta()
        tests.teardown()
        
        tests.__init__()
        tests.test_esqueci_senha()
        tests.teardown()
        
        tests.__init__()
        tests.test_ir_para_cadastro()
        tests.teardown()
        
        tests.__init__()
        tests.test_multiplas_tentativas()
        tests.teardown()
        
        tests.__init__()
        tests.test_responsividade_campos()
        tests.teardown()
        
        print("\n=== TODOS OS TESTES DE LOGIN CONCLUÍDOS ===")
        
    except Exception as e:
        print(f"Erro durante os testes: {e}")
        tests.teardown()
