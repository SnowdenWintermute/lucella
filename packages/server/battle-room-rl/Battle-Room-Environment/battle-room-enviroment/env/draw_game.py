import pygame
import math

BG_COLOR = pygame.Color('#162229')
PRIMARY_COLOR = pygame.Color('#9ba8b8')
ACCENT_COLOR = pygame.Color('#080b11')
SELECT_COLOR = pygame.Color('#ffc0cb')
pygame.init()
default_font = pygame.font.get_default_font()
font = pygame.font.SysFont(["freesansbold","arial","times"], 20)

def draw_orb(game_window, orb, colorPrimary, colorAccent):
    # font = pygame.font.SysFont("freesansbold", 12)
    x = orb.body.position.x
    y = orb.body.position.y
    r = orb.body.circleRadius
    pygame.draw.circle(game_window, colorPrimary, (x,y),r)
    pygame.draw.circle(game_window, colorAccent, (x,y),r, width=2)
# str(orb.number + 1)
    orb_number_surface = font.render(str(orb.id), True, colorAccent)
    orb_number_rect = orb_number_surface.get_rect()
    orb_number_rect.center = (x, y)
    game_window.blit(orb_number_surface, orb_number_rect)

def draw_endzones(game_window, game):
    host_end_zone = game.endzones.host
    challenger_end_zone = game.endzones.challenger
    # print("RECT: ", pygame.Rect(host_end_zone.x, host_end_zone.y, host_end_zone.width, host_end_zone.height))
    # print("RECT VALUES: ", host_end_zone.x, host_end_zone.y, host_end_zone.width, host_end_zone.height)
    pygame.draw.rect(game_window, ACCENT_COLOR, pygame.Rect(host_end_zone.origin.x, host_end_zone.origin.y, host_end_zone.width, host_end_zone.height))
    pygame.draw.line(game_window, PRIMARY_COLOR, (host_end_zone.origin.x, host_end_zone.origin.y+host_end_zone.height), (host_end_zone.origin.x + host_end_zone.width, host_end_zone.origin.y+host_end_zone.height))
    pygame.draw.rect(game_window, ACCENT_COLOR, pygame.Rect(challenger_end_zone.origin.x, challenger_end_zone.origin.y, challenger_end_zone.width, challenger_end_zone.height))
    pygame.draw.line(game_window, PRIMARY_COLOR, (challenger_end_zone.origin.x, challenger_end_zone.origin.y), (challenger_end_zone.origin.x + challenger_end_zone.width, challenger_end_zone.origin.y))

def draw_game(game_window, game):
    game_window.fill(BG_COLOR)
        # self.game_window.fill('white')
        # print(jsBattleSchoolEnv.game.orbs.host)
    for orbLabel in game.orbs.host:
        orb = game.orbs.host[orbLabel]
        draw_orb(game_window, orb, PRIMARY_COLOR, ACCENT_COLOR)

    for orbLabel in game.orbs.challenger:
        orb = game.orbs.challenger[orbLabel]
        draw_orb(game_window, orb, ACCENT_COLOR, PRIMARY_COLOR)

    draw_endzones(game_window, game)

