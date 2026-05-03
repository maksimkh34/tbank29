---
title: Технологии хранения данных
sidebar_position: 1
---

# Технологии хранения данных

Исходя из скоупа проекта, выделены следующие сущности для хранения:

| Сущность | Атрибуты | Акторы | Характер данных |
| :--- | :--- | :--- | :--- |
| **User** | id (UUID), email, created_at, settings (JSON), password_hash | backend | транзакционные |
| **Provider** | id, name, type (bank/manual) | backend, пользователь | транзакционные |
| **Account** | id, user_id, provider_id, type, currency_code, balance | backend, пользователь | транзакционные |
| **Budget** | id, user_id, name, amount, period | backend, пользователь | транзакционные |
| **Category** | id, user_id, name, parent_id, icon_id | backend, пользователь, ML | транзакционные |
| **Icon** | icon_id, storage_key | backend | ресурс |
| **Transaction** | id, account_id, amount, date, category_id, description, budget_id | backend, пользователь | транзакционные + аналитические |
| **BankTransaction**| id, account_id, amount, date, guessed_category_id | backend, пользователь | транзакционные + аналитические |

## Анализ характеристик

| Характеристика | Требование |
| :--- | :--- |
| **Объем данных** | От 1 ГБ до 1 ТБ для транзакционных сущностей. |
| **Паттерны** | Преимущественно OLTP (On-line Transactional Processing). |
| **Консистентность**| Strong Consistency для пользователей, Eventual для аналитики. |
| **Транзакции** | Критично для Account и Transaction. |
| **Поиск** | Агрегация, группировка и фильтрация для транзакций. |

## Выбор стека

- **Реляционная БД**: PostgreSQL. Идеально подходит для обеспечения транзакционной целостности и выполнения сложных аналитических запросов.
- **Объектное хранилище**: S3-совместимое хранилище (для иконок категорий и других медиа-ресурсов).
