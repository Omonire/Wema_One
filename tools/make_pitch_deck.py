#!/usr/bin/env python3
"""
Luma — Pitch Deck Generator
===========================
Generates `Luma_Pitch_Deck.pptx` using python-pptx, styled with the Luma brand
palette (same tokens as the web app: primary #0052FF, tertiary #00A86B, etc.).

Usage:
    python tools/make_pitch_deck.py            # writes Luma_Pitch_Deck.pptx
    python tools/make_pitch_deck.py out.pptx   # custom output path
"""

import os
import sys

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

# ----------------------------------------------------------------------------
# Brand tokens (mirror Frontend/src/index.css)
# ----------------------------------------------------------------------------
PRIMARY        = RGBColor(0x00, 0x3E, 0xC7)  # primary
PRIMARY_CONT   = RGBColor(0x00, 0x52, 0xFF)  # primary-container
PRIMARY_FIXED  = RGBColor(0xDD, 0xE1, 0xFF)  # primary-fixed
PRIMARY_DIM    = RGBColor(0xB7, 0xC4, 0xFF)  # primary-fixed-dim
TERTIARY       = RGBColor(0x00, 0x5A, 0x3C)  # tertiary
TERTIARY_CONT  = RGBColor(0x00, 0x75, 0x50)  # tertiary-container
TERTIARY_FIXED = RGBColor(0x6F, 0xFB, 0xBE)  # tertiary-fixed
SURFACE        = RGBColor(0xF8, 0xF9, 0xFF)  # surface
SURFACE_LOW    = RGBColor(0xEF, 0xF4, 0xFF)  # surface-container-low
SURFACE_HIGH   = RGBColor(0xDC, 0xE9, 0xFF)  # surface-container-high
DARK           = RGBColor(0x0A, 0x0D, 0x14)  # hero dark
ON_SURFACE     = RGBColor(0x0B, 0x1C, 0x30)  # on-surface
ON_VARIANT     = RGBColor(0x43, 0x46, 0x56)  # on-surface-variant
OUTLINE        = RGBColor(0xC3, 0xC5, 0xD9)  # outline-variant
WHITE          = RGBColor(0xFF, 0xFF, 0xFF)
ERROR          = RGBColor(0xBA, 0x1A, 0x1A)

HEAD_FONT = "Plus Jakarta Sans"   # falls back gracefully if not installed
BODY_FONT = "Inter"

SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)

prs = Presentation()
prs.slide_width = SLIDE_W
prs.slide_height = SLIDE_H
BLANK = prs.slide_layouts[6]


# ----------------------------------------------------------------------------
# Low-level helpers
# ----------------------------------------------------------------------------
def add_slide():
    return prs.slides.add_slide(BLANK)


def solid(shape, color):
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    shape.shadow.inherit = False
    return shape


def rect(slide, x, y, w, h, color, rounded=False, radius=0.08):
    shp = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE,
        x, y, w, h,
    )
    if rounded:
        try:
            shp.adjustments[0] = radius
        except Exception:
            pass
    return solid(shp, color)


def oval(slide, x, y, w, h, color):
    shp = slide.shapes.add_shape(MSO_SHAPE.OVAL, x, y, w, h)
    return solid(shp, color)


def textbox(slide, x, y, w, h, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    return tb


def set_run(run, text, size, color, bold=False, font=BODY_FONT, italic=False):
    run.text = text
    f = run.font
    f.size = Pt(size)
    f.bold = bold
    f.italic = italic
    f.name = font
    f.color.rgb = color
    return run


def para(tf, text, size, color, bold=False, font=BODY_FONT, align=PP_ALIGN.LEFT,
         space_before=0, space_after=0, first=False, line=None):
    p = tf.paragraphs[0] if first and not tf.paragraphs[0].runs else tf.add_paragraph()
    p.alignment = align
    p.space_before = Pt(space_before)
    p.space_after = Pt(space_after)
    if line:
        p.line_spacing = line
    set_run(p.add_run(), text, size, color, bold, font)
    return p


def kicker(slide, text, x, y, color=PRIMARY_CONT, size=12, w=Inches(9)):
    """Small uppercase eyebrow label."""
    tb = textbox(slide, x, y, w, Inches(0.32))
    para(tb.text_frame, text.upper(), size, color, bold=True, font=BODY_FONT, first=True)
    return tb


def title(slide, text, x, y, w, size=34, color=ON_SURFACE, h=Inches(1.15)):
    tb = textbox(slide, x, y, w, h)
    para(tb.text_frame, text, size, color, bold=True, font=HEAD_FONT, first=True, line=1.05)
    return tb


def page_num(slide, n, total, dark=False):
    tb = textbox(slide, SLIDE_W - Inches(1.0), SLIDE_H - Inches(0.52), Inches(0.6), Inches(0.3))
    para(tb.text_frame, f"{n:02d} / {total}", 10, PRIMARY_DIM if dark else ON_VARIANT,
         font=BODY_FONT, align=PP_ALIGN.RIGHT, first=True)


def brand_mark(slide, x=Inches(0.6), y=Inches(0.42), on_dark=False):
    """Luma logo mark: rounded square + wordmark."""
    mark = rect(slide, x, y, Inches(0.34), Inches(0.34), PRIMARY_CONT, rounded=True, radius=0.28)
    tf = mark.text_frame
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    para(tf, "L", 16, WHITE, bold=True, font=HEAD_FONT, align=PP_ALIGN.CENTER, first=True)
    tb = textbox(slide, x + Inches(0.44), y + Inches(0.015), Inches(2), Inches(0.35))
    para(tb.text_frame, "Luma", 18, WHITE if on_dark else ON_SURFACE, bold=True,
         font=HEAD_FONT, first=True)
    return mark


def card(slide, x, y, w, h, fill=SURFACE, border=OUTLINE):
    """Card with subtle outline."""
    shp = rect(slide, x, y, w, h, fill, rounded=True, radius=0.07)
    shp.line.color.rgb = border
    shp.line.width = Pt(1)
    return shp


def bullets(slide, items, x, y, w, size=14, gap=10, color=ON_SURFACE, marker_color=PRIMARY_CONT,
            bold_first=True):
    """Simple bullet list with colored markers."""
    tb = textbox(slide, x, y, w, Inches(0.5 + 0.42 * len(items)))
    tf = tb.text_frame
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(gap)
        if line_spacer := None:
            pass
        if isinstance(item, tuple):
            head, rest = item
            r1 = p.add_run()
            set_run(r1, "●  ", size - 3, marker_color, bold=True)
            r2 = p.add_run()
            set_run(r2, head, size, color, bold=bold_first)
            if rest:
                r3 = p.add_run()
                set_run(r3, " — " + rest, size, ON_VARIANT)
        else:
            r1 = p.add_run()
            set_run(r1, "●  ", size - 3, marker_color, bold=True)
            r2 = p.add_run()
            set_run(r2, item, size, color)
    return tb


def stat_chip(slide, x, y, value, label, color=PRIMARY_CONT, w=Inches(2.9), h=Inches(1.5)):
    """Big-number stat card."""
    card(slide, x, y, w, h, fill=SURFACE_LOW, border=PRIMARY_FIXED)
    tb = textbox(slide, x + Inches(0.25), y + Inches(0.16), w - Inches(0.5), h - Inches(0.3))
    para(tb.text_frame, value, 30, color, bold=True, font=HEAD_FONT, first=True)
    para(tb.text_frame, label, 11.5, ON_VARIANT, space_before=4, line=1.05)
    return tb


def ring_decoration(slide, x, y, size, color=PRIMARY_CONT, opacity_hint=True):
    """Concentric rings — the geometric decoration from the web CTA."""
    for r, w in ((0.95, 1.5), (0.6, 1.5), (0.25, 1.5)):
        ring = slide.shapes.add_shape(MSO_SHAPE.OVAL,
                                      x + Emu(int(size * (1 - r) / 2)),
                                      y + Emu(int(size * (1 - r) / 2)),
                                      Emu(int(size * r)), Emu(int(size * r)))
        ring.fill.background()
        ring.line.color.rgb = color
        ring.line.width = Pt(w)
        ring.shadow.inherit = False


# ============================================================================
# SLIDE 1 — TITLE
# ============================================================================
s = add_slide()
solid(s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SLIDE_W, SLIDE_H), DARK)
# ambient glow blobs
glow1 = oval(s, Inches(8.2), Inches(-2.2), Inches(8), Inches(8), RGBColor(0x00, 0x2A, 0x80))
glow2 = oval(s, Inches(-2.5), Inches(4.5), Inches(6), Inches(6), RGBColor(0x00, 0x33, 0x33))
# soft edge illusion: overlay slightly lighter ovals
oval(s, Inches(8.9), Inches(-1.5), Inches(6.6), Inches(6.6), RGBColor(0x00, 0x2F, 0x8A))
oval(s, Inches(-1.9), Inches(5.1), Inches(4.8), Inches(4.8), RGBColor(0x00, 0x3D, 0x3D))

brand_mark(s, on_dark=True)
kicker(s, "Investor & Partner Pitch · 2026", Inches(0.6), Inches(2.1), color=PRIMARY_DIM)

tb = textbox(s, Inches(0.6), Inches(2.45), Inches(11.5), Inches(2.6))
para(tb.text_frame, "Great customer service,", 54, WHITE, bold=True, font=HEAD_FONT,
     first=True, line=1.02)
para(tb.text_frame, "with zero waiting.", 54, PRIMARY_DIM, bold=True, font=HEAD_FONT, line=1.02)

tb = textbox(s, Inches(0.6), Inches(4.6), Inches(9.5), Inches(0.9))
para(tb.text_frame,
     "Luma connects appointments, paperwork, payments, and live help behind one queue — "
     "so customers never wait twice and staff never repeat themselves.",
     16, RGBColor(0xC9, 0xD4, 0xE8), first=True, line=1.25)

# trust strip
strip = ["4.9★ rated · 42 offices", "99.9% paperwork approved first time", "4 min average wait"]
x = Inches(0.6)
for label in strip:
    chip = rect(s, x, Inches(5.9), Inches(3.2), Inches(0.52), RGBColor(0x14, 0x1A, 0x26),
                rounded=True, radius=0.5)
    chip.line.color.rgb = RGBColor(0x2A, 0x33, 0x44)
    chip.line.width = Pt(1)
    tf = chip.text_frame
    tf.margin_left = tf.margin_right = Inches(0.1)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    para(tf, label, 11, PRIMARY_FIXED, bold=True, align=PP_ALIGN.CENTER, first=True)
    x += Inches(3.45)

page_num(s, 1, 13, dark=True)


# ============================================================================
# SLIDE 2 — PROBLEM
# ============================================================================
s = add_slide()
rect(s, 0, 0, SLIDE_W, SLIDE_H, SURFACE)
brand_mark(s)
kicker(s, "The problem", Inches(0.6), Inches(1.25))
title(s, "You want one simple visit.\nBut organizations make you jump through six hoops.",
      Inches(0.6), Inches(1.6), Inches(11.5), size=30)

pain_points = [
    ("Endless waiting lines", "Hours on a plastic chair, no idea when your number is called."),
    ("Turned away at the counter", "Missing document discovered after an hour of waiting — start over tomorrow."),
    ("Repeating yourself", "Every staff member asks the same questions from scratch."),
    ("Surprise fees", "Charges disclosed only after the service is done."),
]
pain_fill = RGBColor(0xFF, 0xDA, 0xD6)   # error-container
pain_edge = ERROR
x = Inches(0.6)
for head, sub in pain_points:
    c = card(s, x, Inches(3.0), Inches(2.95), Inches(2.4), fill=SURFACE, border=pain_edge)
    c.line.width = Pt(1.25)
    bar = rect(s, x, Inches(3.0), Inches(0.09), Inches(2.4), pain_edge)
    tb = textbox(s, x + Inches(0.28), Inches(3.3), Inches(2.5), Inches(2.0))
    para(tb.text_frame, "✕", 16, pain_edge, bold=True, first=True)
    para(tb.text_frame, head, 15, ON_SURFACE, bold=True, font=HEAD_FONT, space_before=4)
    para(tb.text_frame, sub, 11.5, ON_VARIANT, space_before=4, line=1.15)
    x += Inches(3.12)

result = rect(s, Inches(0.6), Inches(5.85), Inches(12.13), Inches(0.7), pain_fill,
              rounded=True, radius=0.3)
tf = result.text_frame
tf.vertical_anchor = MSO_ANCHOR.MIDDLE
para(tf, "Result: wasted hours, tired staff, and angry customers — for something that should take 15 minutes.",
     13, RGBColor(0x93, 0x00, 0x0A), bold=True, align=PP_ALIGN.CENTER, first=True)
page_num(s, 2, 13)


# ============================================================================
# SLIDE 3 — SOLUTION
# ============================================================================
s = add_slide()
rect(s, 0, 0, SLIDE_W, SLIDE_H, SURFACE)
brand_mark(s)
kicker(s, "The solution", Inches(0.6), Inches(1.25))
title(s, "One connected experience. Zero waiting games.",
      Inches(0.6), Inches(1.6), Inches(11.5), size=32)
tb = textbox(s, Inches(0.6), Inches(2.5), Inches(11.8), Inches(0.75))
para(tb.text_frame,
     "Luma is an operating layer for in-person service: every step of a visit runs on one platform, "
     "before the customer ever leaves home.",
     14.5, ON_VARIANT, first=True, line=1.2)

solutions = [
    ("Line Saver", "Digital tickets with live position. Customers leave home exactly on time.", "confirmation_number"),
    ("Paperwork Check", "Documents uploaded and AI-verified before the visit. Never turned away.", "verified_user"),
    ("Easy Payments", "Fees paid from the phone with instant receipts. Zero hidden charges.", "payments"),
    ("Staff Help Desk", "Serving officers see the full file. Customers never repeat themselves.", "hub"),
]
x = Inches(0.6)
for head, sub, _icon in solutions:
    c = card(s, x, Inches(3.45), Inches(2.95), Inches(2.5), fill=SURFACE_LOW, border=PRIMARY_FIXED)
    dot = oval(s, x + Inches(0.28), Inches(3.75), Inches(0.5), Inches(0.5), PRIMARY_CONT)
    dtf = dot.text_frame
    dtf.vertical_anchor = MSO_ANCHOR.MIDDLE
    para(dtf, "✓", 14, WHITE, bold=True, align=PP_ALIGN.CENTER, first=True)
    tb = textbox(s, x + Inches(0.28), Inches(4.45), Inches(2.4), Inches(1.4))
    para(tb.text_frame, head, 15, ON_SURFACE, bold=True, font=HEAD_FONT, first=True)
    para(tb.text_frame, sub, 11.5, ON_VARIANT, space_before=5, line=1.18)
    x += Inches(3.12)

page_num(s, 3, 13)


# ============================================================================
# SLIDE 4 — PRODUCT: HOW IT WORKS (LIFECYCLE RAIL)
# ============================================================================
s = add_slide()
rect(s, 0, 0, SLIDE_W, SLIDE_H, SURFACE)
brand_mark(s)
kicker(s, "Product", Inches(0.6), Inches(1.25))
title(s, "Watch a visit unfold — seven steps, one platform.",
      Inches(0.6), Inches(1.6), Inches(11.5), size=30)

steps = [
    ("Start", "Ticket saved from home"),
    ("Choose Time", "Arrival slot booked"),
    ("Check Papers", "Docs AI-verified"),
    ("Pay Fee", "Instant receipt"),
    ("Walk In", "3rd in line, 6 min"),
    ("Get Served", "File already open"),
    ("Done Happy", "14 min total visit"),
]
rail_y = Inches(3.15)
# track
rect(s, Inches(1.0), rail_y + Inches(0.34), Inches(11.2), Inches(0.05), SURFACE_HIGH)
rect(s, Inches(1.0), rail_y + Inches(0.34), Inches(8.2), Inches(0.05), PRIMARY_CONT)
cx = Inches(1.0)
for i, (head, sub) in enumerate(steps):
    done = i <= 3
    active = i == 3
    node = oval(s, cx - Inches(0.24), rail_y + Inches(0.11), Inches(0.52), Inches(0.52),
                PRIMARY_CONT if done else SURFACE_HIGH)
    if active:
        halo = oval(s, cx - Inches(0.34), rail_y + Inches(0.01), Inches(0.72), Inches(0.72),
                    PRIMARY_FIXED)
        halo.text_frame.text = ""
        node = oval(s, cx - Inches(0.24), rail_y + Inches(0.11), Inches(0.52), Inches(0.52), PRIMARY_CONT)
    tf = node.text_frame
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    para(tf, "✓" if done else f"{i + 1:02d}", 12, WHITE if done else ON_VARIANT, bold=True,
         align=PP_ALIGN.CENTER, first=True)
    tb = textbox(s, cx - Inches(0.85), rail_y + Inches(0.78), Inches(1.7), Inches(0.75))
    para(tb.text_frame, head, 12.5, ON_SURFACE if done else ON_VARIANT, bold=done,
         align=PP_ALIGN.CENTER, first=True)
    para(tb.text_frame, sub, 9.5, ON_VARIANT, align=PP_ALIGN.CENTER, space_before=2)
    cx += Inches(1.866)

panel = card(s, Inches(0.6), Inches(4.9), Inches(12.13), Inches(1.35), fill=SURFACE_LOW,
             border=PRIMARY_FIXED)
tb = textbox(s, Inches(1.0), Inches(5.15), Inches(11.3), Inches(0.9))
para(tb.text_frame, "STEP 04 · PAY FEE", 11, PRIMARY, bold=True, first=True)
para(tb.text_frame, "$45.00 paid instantly — receipt sent to the customer's phone. "
     "Every step above happens automatically for every customer.",
     13.5, ON_SURFACE, space_before=4)
page_num(s, 4, 13)


# ============================================================================
# SLIDE 5 — UNDER THE HOOD (ARCHITECTURE)
# ============================================================================
s = add_slide()
rect(s, 0, 0, SLIDE_W, SLIDE_H, SURFACE)
brand_mark(s)
kicker(s, "Under the hood", Inches(0.6), Inches(1.25))
title(s, "A real, working platform — not a mockup.",
      Inches(0.6), Inches(1.6), Inches(11.5), size=30)

arch = [
    ("Frontend", "React 19 + Vite · Tailwind v4 design system · 24 pages · role-based dashboards for Customers, Branch Officers, Managers, Admins", PRIMARY_CONT),
    ("API Layer", "Flask · 16 blueprints / 90+ REST endpoints · JWT auth with 5 roles · marshmallow schemas", PRIMARY_CONT),
    ("Intelligence", "AI document verification (OCR + field matching) · feedback sentiment & topic analysis · optional Groq/Gemini providers", TERTIARY_CONT),
    ("Payments", "ALAT Authenticator consent-based direct debit · Pay-with-Bank flow · transaction refs & reconciliation fields", TERTIARY_CONT),
]
y = Inches(2.6)
for head, sub, accent in arch:
    c = card(s, Inches(0.6), y, Inches(12.13), Inches(0.98), fill=SURFACE, border=OUTLINE)
    rect(s, Inches(0.6), y, Inches(0.09), Inches(0.98), accent)
    tb = textbox(s, Inches(0.95), y + Inches(0.14), Inches(2.6), Inches(0.7), anchor=MSO_ANCHOR.MIDDLE)
    para(tb.text_frame, head, 15, ON_SURFACE, bold=True, font=HEAD_FONT, first=True)
    tb = textbox(s, Inches(3.7), y + Inches(0.14), Inches(8.8), Inches(0.7), anchor=MSO_ANCHOR.MIDDLE)
    para(tb.text_frame, sub, 12, ON_VARIANT, first=True, line=1.12)
    y += Inches(1.13)

tb = textbox(s, Inches(0.6), Inches(7.0), Inches(12), Inches(0.4))
para(tb.text_frame, "Deploy-ready: PostgreSQL + Gunicorn (Render) · Vercel frontend · seeded demo data for all 5 roles",
     11, ON_VARIANT, first=True)
page_num(s, 5, 13)


# ============================================================================
# SLIDE 6 — WHY NOW
# ============================================================================
s = add_slide()
rect(s, 0, 0, SLIDE_W, SLIDE_H, SURFACE)
brand_mark(s)
kicker(s, "Why now", Inches(0.6), Inches(1.25))
title(s, "Three shifts make Luma inevitable.",
      Inches(0.6), Inches(1.6), Inches(11.5), size=32)

why = [
    ("01", "Digital-first customers", "People already book flights, order food, and track parcels live. They now expect the same visibility from their bank, hospital, or government office."),
    ("02", "AI made paperwork cheap", "Document verification that required back-office staff now runs in seconds — pre-visit checks are finally viable at scale."),
    ("03", "Branches aren't dying — queues are", "Complex services still need in-person visits. The winners will be the ones who make the visit itself effortless."),
]
y = Inches(2.7)
for num, head, sub in why:
    tb = textbox(s, Inches(0.6), y, Inches(1.1), Inches(1.0))
    para(tb.text_frame, num, 30, PRIMARY_FIXED, bold=True, font=HEAD_FONT, first=True)
    tb = textbox(s, Inches(1.75), y + Inches(0.02), Inches(10.8), Inches(1.1))
    para(tb.text_frame, head, 17, ON_SURFACE, bold=True, font=HEAD_FONT, first=True)
    para(tb.text_frame, sub, 12.5, ON_VARIANT, space_before=3, line=1.18)
    y += Inches(1.42)
page_num(s, 6, 13)


# ============================================================================
# SLIDE 7 — MARKET
# ============================================================================
s = add_slide()
rect(s, 0, 0, SLIDE_W, SLIDE_H, SURFACE)
brand_mark(s)
kicker(s, "Market", Inches(0.6), Inches(1.25))
title(s, "Every counter that makes people wait is our market.",
      Inches(0.6), Inches(1.6), Inches(11.5), size=32)

stat_chip(s, Inches(0.6), Inches(2.9), "Beachhead", "Nigerian commercial bank branches — 5,000+ with daily queue pain", PRIMARY_CONT, h=Inches(1.65))
stat_chip(s, Inches(3.75), Inches(2.9), "Expansion", "Hospitals, clinics & government offices — same queue + paperwork pain", TERTIARY_CONT, h=Inches(1.65))
stat_chip(s, Inches(6.9), Inches(2.9), "Platform", "Telecoms & online apps — service centres at national scale", PRIMARY_CONT, h=Inches(1.65))
stat_chip(s, Inches(10.05), Inches(2.9), "Model", "SaaS per branch / month + usage-based payments & verification fees", TERTIARY_CONT, h=Inches(1.65))

band = card(s, Inches(0.6), Inches(4.9), Inches(12.13), Inches(1.5), fill=DARK, border=DARK)
tb = textbox(s, Inches(1.0), Inches(5.15), Inches(11.3), Inches(1.1))
para(tb.text_frame, "Sectors we serve today", 12, PRIMARY_DIM, bold=True, first=True)
para(tb.text_frame, "Banks  ·  Hospitals & Clinics  ·  Government Offices  ·  Phone Companies  ·  Online Apps",
     16, WHITE, bold=True, font=HEAD_FONT, space_before=6)
page_num(s, 7, 13)


# ============================================================================
# SLIDE 8 — BUSINESS MODEL
# ============================================================================
s = add_slide()
rect(s, 0, 0, SLIDE_W, SLIDE_H, SURFACE)
brand_mark(s)
kicker(s, "Business model", Inches(0.6), Inches(1.25))
title(s, "Simple, recurring, and tied to real usage.",
      Inches(0.6), Inches(1.6), Inches(11.5), size=32)

tiers = [
    ("Starter", "$99", "/branch/month", ["Digital queue & tickets", "Appointments & reminders", "Basic analytics"], PRIMARY_CONT),
    ("Growth", "$249", "/branch/month", ["Everything in Starter", "AI document verification", "Payments & ALAT direct debit", "Feedback intelligence"], TERTIARY_CONT),
    ("Enterprise", "Custom", "per organisation", ["Everything in Growth", "Multi-branch rollout & SSO", "API access & integrations", "Dedicated success team"], PRIMARY_CONT),
]
x = Inches(0.6)
for name, price, unit, feats, accent in tiers:
    featured = name == "Growth"
    c = card(s, x, Inches(2.75), Inches(3.95), Inches(3.6),
             fill=DARK if featured else SURFACE, border=accent if not featured else accent)
    if featured:
        badge = rect(s, x + Inches(2.6), Inches(2.55), Inches(1.15), Inches(0.4), TERTIARY_FIXED,
                     rounded=True, radius=0.5)
        btf = badge.text_frame
        btf.vertical_anchor = MSO_ANCHOR.MIDDLE
        para(btf, "POPULAR", 9, TERTIARY, bold=True, align=PP_ALIGN.CENTER, first=True)
    tb = textbox(s, x + Inches(0.35), Inches(3.05), Inches(3.3), Inches(3.1))
    para(tb.text_frame, name, 14, WHITE if featured else ON_VARIANT, bold=True, first=True)
    para(tb.text_frame, price, 30, WHITE if featured else ON_SURFACE, bold=True, font=HEAD_FONT, space_before=2)
    para(tb.text_frame, unit, 11, PRIMARY_DIM if featured else ON_VARIANT, space_before=1)
    for f in feats:
        para(tb.text_frame, "✓  " + f, 11.5, WHITE if featured else ON_SURFACE, space_before=6)
    x += Inches(4.15)

page_num(s, 8, 13)


# ============================================================================
# SLIDE 9 — COMPETITION / MOAT
# ============================================================================
s = add_slide()
rect(s, 0, 0, SLIDE_W, SLIDE_H, SURFACE)
brand_mark(s)
kicker(s, "Why Luma wins", Inches(0.6), Inches(1.25))
title(s, "Point tools fix one hoop. Luma removes the queue.",
      Inches(0.6), Inches(1.6), Inches(11.5), size=30)

rows = [
    ("Point queue apps", "Digital tickets only", "Digital tickets only", "Digital tickets only", "✓ Digital tickets + docs + payments + insights"),
    ("Bank's homegrown tools", "Per-bank silo", "Per-bank silo", "Per-bank silo", "✓ Cross-industry platform & shared learning"),
    ("Luma", "One connected visit", "AI paperwork pre-check", "In-visit payments", "✓ Network effects: every branch makes the next smarter"),
]
hdr_y = Inches(2.65)
col_x = [Inches(0.6), Inches(4.15), Inches(7.1), Inches(10.05)]
col_w = [Inches(3.4), Inches(2.8), Inches(2.8), Inches(2.75)]
headers = ["", "Queue", "Paperwork", "Payments"]
for i in range(4):
    tb = textbox(s, col_x[i], hdr_y, col_w[i], Inches(0.4))
    para(tb.text_frame, headers[i].upper(), 11, ON_VARIANT, bold=True, first=True)

y = hdr_y + Inches(0.5)
for name, q, p, pay, edge in rows:
    is_luma = name == "Luma"
    row_card = card(s, Inches(0.6), y, Inches(12.13), Inches(0.92),
                    fill=DARK if is_luma else SURFACE, border=PRIMARY_CONT if is_luma else OUTLINE)
    tb = textbox(s, Inches(0.95), y + Inches(0.03), col_w[0] - Inches(0.3), Inches(0.86), anchor=MSO_ANCHOR.MIDDLE)
    para(tb.text_frame, name, 15, WHITE if is_luma else ON_SURFACE, bold=True, font=HEAD_FONT, first=True)
    for i, val in enumerate((q, p, pay), start=1):
        tb = textbox(s, col_x[i], y + Inches(0.03), col_w[i] - Inches(0.2), Inches(0.86), anchor=MSO_ANCHOR.MIDDLE)
        para(tb.text_frame, val, 11.5, PRIMARY_DIM if is_luma else ON_VARIANT, first=True)
    y += Inches(1.07)

foot = card(s, Inches(0.6), y + Inches(0.1), Inches(12.13), Inches(0.6), fill=PRIMARY_FIXED, border=PRIMARY_FIXED)
tf = foot.text_frame
tf.vertical_anchor = MSO_ANCHOR.MIDDLE
para(tf, "Moat: shared branch learning (BranchConnect) — solutions posted by one office propagate to all 42.",
     12.5, PRIMARY, bold=True, align=PP_ALIGN.CENTER, first=True)
page_num(s, 9, 13)


# ============================================================================
# SLIDE 10 — TRACTION & ROADMAP
# ============================================================================
s = add_slide()
rect(s, 0, 0, SLIDE_W, SLIDE_H, SURFACE)
brand_mark(s)
kicker(s, "Traction & roadmap", Inches(0.6), Inches(1.25))
title(s, "Built and proven. Now we roll out.",
      Inches(0.6), Inches(1.6), Inches(11.5), size=32)

kicker(s, "Shipped today", Inches(0.6), Inches(2.55), color=TERTIARY_CONT, size=11, w=Inches(5.5))
done_items = [
    "Full platform: queue, appointments, documents, payments, feedback, notifications",
    "AI document verification & feedback sentiment analysis (pluggable providers)",
    "ALAT consent-based payments integration (sandbox-ready)",
    "5-role RBAC, audit logs, analytics — deployed configs for Render + Vercel",
]
bullets(s, done_items, Inches(0.6), Inches(2.95), Inches(5.9), size=13, marker_color=TERTIARY_CONT)

kicker(s, "Next 12 months", Inches(7.0), Inches(2.55), color=PRIMARY_CONT, size=11, w=Inches(5.5))
next_items = [
    "Pilot: 3 bank branches (design partners)",
    "WhatsApp-native ticketing & notifications",
    "Biometric (face) check-in at the counter",
    "Multi-tenant rollout: hospitals & government offices",
    "Open API for partner fintechs",
]
bullets(s, next_items, Inches(7.0), Inches(2.95), Inches(5.7), size=13, marker_color=PRIMARY_CONT)

# progress bar visual
bar_y = Inches(5.9)
rect(s, Inches(0.6), bar_y, Inches(12.13), Inches(0.35), SURFACE_HIGH, rounded=True, radius=0.5)
rect(s, Inches(0.6), bar_y, Inches(4.6), Inches(0.35), TERTIARY_CONT, rounded=True, radius=0.5)
tb = textbox(s, Inches(0.6), bar_y + Inches(0.5), Inches(12), Inches(0.4))
para(tb.text_frame, "Product maturity: core platform complete → pilot hardening → multi-sector scale",
     11.5, ON_VARIANT, first=True)
page_num(s, 10, 13)


# ============================================================================
# SLIDE 11 — TEAM & THE ASK
# ============================================================================
s = add_slide()
rect(s, 0, 0, SLIDE_W, SLIDE_H, SURFACE)
brand_mark(s)
kicker(s, "The ask", Inches(0.6), Inches(1.25))
title(s, "Raising to turn a working product into a rollout.",
      Inches(0.6), Inches(1.6), Inches(11.5), size=30)

asks = [
    ("$500K pre-seed", "18-month runway to convert 3 design partners into 40+ paying branches", PRIMARY_CONT),
    ("Pilot engineer + field success", "Two hires to harden pilots and make branch onboarding turnkey", TERTIARY_CONT),
    ("Design-partner intros", "Warm intros to branch operations leaders in Nigerian commercial banks", PRIMARY_CONT),
]
x = Inches(0.6)
for head, sub, accent in asks:
    c = card(s, x, Inches(2.8), Inches(3.95), Inches(2.1), fill=SURFACE_LOW, border=PRIMARY_FIXED)
    rect(s, x, Inches(2.8), Inches(0.09), Inches(2.1), accent)
    tb = textbox(s, x + Inches(0.32), Inches(3.1), Inches(3.4), Inches(1.7))
    para(tb.text_frame, head, 17, ON_SURFACE, bold=True, font=HEAD_FONT, first=True)
    para(tb.text_frame, sub, 12, ON_VARIANT, space_before=6, line=1.2)
    x += Inches(4.15)

note = card(s, Inches(0.6), Inches(5.35), Inches(12.13), Inches(1.2), fill=DARK, border=DARK)
tb = textbox(s, Inches(1.0), Inches(5.55), Inches(11.3), Inches(0.9))
para(tb.text_frame, "Team", 11, PRIMARY_DIM, bold=True, first=True)
para(tb.text_frame, "Built by a product engineer who has shipped the entire stack — frontend, "
     "backend, AI services, and payments — and is ready to scale it with you.",
     13.5, WHITE, space_before=4, line=1.2)
page_num(s, 11, 13)


# ============================================================================
# SLIDE 12 — LIVE DEMO CREDENTIALS
# ============================================================================
s = add_slide()
rect(s, 0, 0, SLIDE_W, SLIDE_H, SURFACE)
brand_mark(s)
kicker(s, "Live demo", Inches(0.6), Inches(1.25))
title(s, "Try it yourself — a seeded account for every role.",
      Inches(0.6), Inches(1.6), Inches(11.5), size=30)
tb = textbox(s, Inches(0.6), Inches(2.42), Inches(11.8), Inches(0.4))
para(tb.text_frame,
     "The database seeds itself on first boot (SEED_DATA=1) — every account below is live with demo data.",
     12.5, ON_VARIANT, first=True)

MONO_FONT = "Consolas"
demo_rows = [
    ("CUSTOMER", "david@test.com", "Book appointments, join the live queue, upload & verify documents, pay with ALAT", PRIMARY_CONT),
    ("BRANCH OFFICER", "officer1@luma.com", "Call the next ticket, review submitted documents, close out visits", TERTIARY_CONT),
    ("BRANCH MANAGER", "manager1@luma.com", "Branch dashboard, appointments, feedback, BranchConnect solutions", TERTIARY_CONT),
    ("ADMIN", "admin@luma.com", "Platform analytics, users, branches, services, feedback intelligence", PRIMARY_CONT),
    ("SUPER ADMIN", "superadmin@luma.com", "Everything above + Social Studio content automation & audit logs", PRIMARY_CONT),
]
y = Inches(2.98)
for role, email, desc, accent in demo_rows:
    c = card(s, Inches(0.6), y, Inches(12.13), Inches(0.7),
             fill=SURFACE_LOW if accent == PRIMARY_CONT else SURFACE, border=OUTLINE)
    rect(s, Inches(0.6), y, Inches(0.09), Inches(0.7), accent)
    tb = textbox(s, Inches(0.92), y + Inches(0.07), Inches(2.05), Inches(0.56), anchor=MSO_ANCHOR.MIDDLE)
    para(tb.text_frame, role, 11.5, accent, bold=True, font=HEAD_FONT, first=True)
    tb = textbox(s, Inches(3.05), y + Inches(0.07), Inches(2.95), Inches(0.56), anchor=MSO_ANCHOR.MIDDLE)
    para(tb.text_frame, email, 12.5, ON_SURFACE, bold=True, font=MONO_FONT, first=True)
    tb = textbox(s, Inches(6.15), y + Inches(0.07), Inches(6.35), Inches(0.56), anchor=MSO_ANCHOR.MIDDLE)
    para(tb.text_frame, desc, 11, ON_VARIANT, first=True)
    y += Inches(0.78)

chip = rect(s, Inches(0.6), Inches(6.95), Inches(12.13), Inches(0.42), DARK, rounded=True, radius=0.5)
tf = chip.text_frame
tf.vertical_anchor = MSO_ANCHOR.MIDDLE
para(tf, "Password for every demo account:  password123    ·    6 customers · 2 officers · 2 managers · 2 admins · 5 branches · 6 services",
     11, PRIMARY_FIXED, bold=True, align=PP_ALIGN.CENTER, first=True)
page_num(s, 12, 13)


# ============================================================================
# SLIDE 13 — CLOSING / CTA
# ============================================================================
s = add_slide()
solid(s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SLIDE_W, SLIDE_H), DARK)
oval(s, Inches(9.0), Inches(3.4), Inches(6.5), Inches(6.5), RGBColor(0x00, 0x2F, 0x8A))
ring_decoration(s, Inches(9.6), Inches(1.9), Inches(3.6), color=PRIMARY_CONT)

brand_mark(s, on_dark=True)
kicker(s, "Try Luma today", Inches(0.6), Inches(2.3), color=PRIMARY_DIM)

tb = textbox(s, Inches(0.6), Inches(2.65), Inches(8.6), Inches(2.0))
para(tb.text_frame, "No more waiting in lines.", 44, WHITE, bold=True, font=HEAD_FONT, first=True, line=1.05)
para(tb.text_frame, "No more guesswork.", 44, PRIMARY_DIM, bold=True, font=HEAD_FONT, line=1.05)

tb = textbox(s, Inches(0.6), Inches(4.75), Inches(8.2), Inches(0.8))
para(tb.text_frame,
     "Give your customers an easy, stress-free experience — and give your staff the tools to help people faster.",
     15, RGBColor(0xC9, 0xD4, 0xE8), first=True, line=1.25)

cta = rect(s, Inches(0.6), Inches(5.8), Inches(2.9), Inches(0.62), PRIMARY_CONT, rounded=True, radius=0.18)
tf = cta.text_frame
tf.vertical_anchor = MSO_ANCHOR.MIDDLE
para(tf, "hello@luma.com", 15, WHITE, bold=True, align=PP_ALIGN.CENTER, first=True)
tb = textbox(s, Inches(3.7), Inches(5.86), Inches(5), Inches(0.5))
para(tb.text_frame, "All systems running smoothly · 99.9% uptime", 11, PRIMARY_FIXED, first=True)
page_num(s, 13, 13, dark=True)


# ----------------------------------------------------------------------------
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "Luma_Pitch_Deck.pptx")
prs.save(out)
print(f"Deck written: {os.path.abspath(out)}  ({len(prs.slides._sldIdLst)} slides)")
