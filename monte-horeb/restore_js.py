import re

with open(r'C:\Users\jpeñaloza\Documents\Antigravity\monte-horeb_backup_pre_rebranding\presupuesto.html', 'r', encoding='utf-8') as f:
    backup_content = f.read()

script_match = re.search(r'(<!-- Script para la calculadora -->\s*<script>.*?</script>)', backup_content, flags=re.DOTALL)
if script_match:
    script_logic = script_match.group(1)
    
    with open('presupuesto.html', 'r', encoding='utf-8') as f:
        current_content = f.read()
    
    if 'Script para la calculadora' not in current_content:
        # Prevent default on click
        script_logic = script_logic.replace(
            "document.getElementById('btnCalculate').addEventListener('click', () => {",
            "document.getElementById('btnCalculate').addEventListener('click', (e) => {\n      e.preventDefault();"
        )
        
        current_content = current_content.replace('</body>', script_logic + '\n</body>')
        
        with open('presupuesto.html', 'w', encoding='utf-8') as f:
            f.write(current_content)
        print('Script successfully added.')
else:
    print('Script not found in regex')
