 INSERT INTO tickets (
    customer_id, title, description, completed, tech, created_at, updated_at
) VALUES
    (1, 'Laptop screen cracked', 'Customer dropped laptop, screen is shattered and needs replacement', false, 'Unassigned', now(), now()),
    (1, 'Slow performance', 'Laptop running very slow, possible malware or needs RAM upgrade', false, 'Unassigned', now(), now()),
    (2, 'Keyboard not working', 'Several keys on keyboard are unresponsive, needs replacement', false, 'Unassigned', now(), now()),
    (3, 'Battery not charging', 'Laptop plugged in but battery percentage keeps dropping', true, 'nifemi@repairshop.com', now(), now()),
    (4, 'Blue screen of death', 'PC randomly crashes with BSOD, likely driver or hardware issue', false, 'Unassigned', now(), now()),
    (5, 'Virus removal', 'Customer reports lots of popups and slow browser, suspected adware', true, 'nifemi@repairshop.com', now(), now()),
    (2, 'Hard drive replacement', 'Old HDD failing, needs to be replaced with SSD', false, 'Unassigned', now(), now()),
    (3, 'WiFi not connecting', 'Device cannot detect any WiFi networks, possible adapter issue', false, 'Unassigned', now(), now());