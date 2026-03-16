<?php
session_start();

require_once 'init.php';

// načtení dat z databáze
$name = 'Neznámý uživatel'; // může být stále z profile.json nebo hardcoded
$skills = []; // může být stále z profile.json nebo hardcoded

// načtení zájmů z databáze
$stmt = $db->query("SELECT * FROM interests");
$projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

// připravíme proměnné pro notifikace ze session
$message = isset($_SESSION['message']) ? $_SESSION['message'] : '';
$messageType = isset($_SESSION['messageType']) ? $_SESSION['messageType'] : '';
unset($_SESSION['message'], $_SESSION['messageType']);

// zpracování formulářů pro přidání, odstranění nebo editaci zájmu
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // přidání zájmu
    if (isset($_POST['new_interest'])) {
        $new = trim($_POST['new_interest']);
        if ($new === '') {
            $_SESSION['message'] = 'Pole nesmí být prázdné.';
            $_SESSION['messageType'] = 'error';
        } else {
            try {
                $stmt = $db->prepare("INSERT INTO interests (name) VALUES (?)");
                $stmt->execute([$new]);
                $_SESSION['message'] = 'Zájem byl přidán.';
                $_SESSION['messageType'] = 'success';
            } catch (PDOException $e) {
                if ($e->getCode() == 23000) { // UNIQUE constraint failed
                    $_SESSION['message'] = 'Tento zájem už existuje.';
                    $_SESSION['messageType'] = 'error';
                } else {
                    $_SESSION['message'] = 'Chyba při přidávání zájmu.';
                    $_SESSION['messageType'] = 'error';
                }
            }
        }
        header("Location: index.php");
        exit;
    }
    // odstranění zájmu
    elseif (isset($_POST['remove_interest'])) {
        $id = (int)$_POST['remove_interest'];
        $stmt = $db->prepare("DELETE FROM interests WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() > 0) {
            $_SESSION['message'] = 'Zájem byl odstraněn.';
            $_SESSION['messageType'] = 'success';
        } else {
            $_SESSION['message'] = 'Zájem nebyl nalezen.';
            $_SESSION['messageType'] = 'error';
        }
        header("Location: index.php");
        exit;
    }
    // zahájení editace
    elseif (isset($_POST['edit_interest'])) {
        $id = (int)$_POST['edit_interest'];
        $_SESSION['editing'] = $id;
        header("Location: index.php");
        exit;
    }
    // uložení editace
    elseif (isset($_POST['save_edit'])) {
        $id = (int)$_POST['save_edit'];
        $new_value = trim($_POST['edited_interest']);
        if ($new_value === '') {
            $_SESSION['message'] = 'Pole nesmí být prázdné.';
            $_SESSION['messageType'] = 'error';
        } else {
            try {
                $stmt = $db->prepare("UPDATE interests SET name = ? WHERE id = ?");
                $stmt->execute([$new_value, $id]);
                if ($stmt->rowCount() > 0) {
                    $_SESSION['message'] = 'Zájem byl upraven.';
                    $_SESSION['messageType'] = 'success';
                    unset($_SESSION['editing']);
                } else {
                    $_SESSION['message'] = 'Zájem nebyl nalezen.';
                    $_SESSION['messageType'] = 'error';
                }
            } catch (PDOException $e) {
                if ($e->getCode() == 23000) { // UNIQUE constraint failed
                    $_SESSION['message'] = 'Tento zájem už existuje.';
                    $_SESSION['messageType'] = 'error';
                } else {
                    $_SESSION['message'] = 'Chyba při úpravě zájmu.';
                    $_SESSION['messageType'] = 'error';
                }
            }
        }
        header("Location: index.php");
        exit;
    }
    // zrušení editace
    elseif (isset($_POST['cancel_edit'])) {
        unset($_SESSION['editing']);
        header("Location: index.php");
        exit;
    }
}

$editing = isset($_SESSION['editing']) ? $_SESSION['editing'] : null;

?>

<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>IT Profil - <?php echo htmlspecialchars($name); ?></title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1><?php echo htmlspecialchars($name); ?></h1>
  </header>
  <main>
    <section>
      <h2>Dovednosti</h2>
      <?php if (!empty($skills)): ?>
        <ul>
          <?php foreach ($skills as $skill): ?>
            <li><?php echo htmlspecialchars($skill); ?></li>
          <?php endforeach; ?>
        </ul>
      <?php else: ?>
        <p>Žádné dovednosti nebyly uvedeny.</p>
      <?php endif; ?>
    </section>
    <section>
      <h2>Projekty / Zájmy</h2>
      <?php if (!empty($projects)): ?>
        <ul>
          <?php foreach ($projects as $interest): ?>
            <li>
              <?php echo htmlspecialchars($interest['name']); ?>
              <form method="POST" style="display: inline;">
                <input type="hidden" name="edit_interest" value="<?php echo $interest['id']; ?>">
                <button type="submit">Upravit</button>
              </form>
              <form method="POST" style="display: inline;">
                <input type="hidden" name="remove_interest" value="<?php echo $interest['id']; ?>">
                <button type="submit" onclick="return confirm('Opravdu chcete odstranit tento zájem?')">Smazat</button>
              </form>
            </li>
          <?php endforeach; ?>
        </ul>
      <?php else: ?>
        <p>Žádné projekty nebo zájmy nebyly uvedeny.</p>
      <?php endif; ?>

      <!-- zpráva o výsledku formuláře -->
      <?php if (!empty($message)): ?>
        <p class="<?php echo htmlspecialchars($messageType); ?>">
          <?php echo htmlspecialchars($message); ?>
        </p>
      <?php endif; ?>

      <!-- formulář pro editaci, pokud je aktivní -->
      <?php if ($editing !== null): ?>
        <?php
        // Najdeme zájem podle id
        $editing_interest = null;
        foreach ($projects as $interest) {
          if ($interest['id'] == $editing) {
            $editing_interest = $interest;
            break;
          }
        }
        ?>
        <?php if ($editing_interest): ?>
          <h3>Upravit zájem</h3>
          <form method="POST">
            <input type="text" name="edited_interest" value="<?php echo htmlspecialchars($editing_interest['name']); ?>" required>
            <input type="hidden" name="save_edit" value="<?php echo $editing_interest['id']; ?>">
            <button type="submit">Uložit změny</button>
            <button type="submit" name="cancel_edit">Zrušit</button>
          </form>
        <?php endif; ?>
      <?php endif; ?>

      <!-- formulář pro nový zájem -->
      <h3>Přidat nový zájem</h3>
      <form method="POST">
        <input type="text" name="new_interest" required>
        <button type="submit">Přidat zájem</button>
      </form>
    </section>
  </main>
</body>
</html>
