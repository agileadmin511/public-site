---
title: "Creating an Active Directory User Report with PowerShell"
description: "Learn how to create a simple Active Directory user report with PowerShell, display the results with Out-GridView, and export the data to CSV for auditing and administration."
pubDate: 2026-09-12
tags:
  - PowerShell
  - Active Directory
  - Windows Server
  - Reporting
  - Administration
draft: false
---

> [!NOTE]
> **Where should I run these commands?**
>
> The Active Directory cmdlets used in this article are part of the Active Directory PowerShell module. If you're running the script from a workstation, you'll typically need the Remote Server Administration Tools (RSAT) installed, specifically the **Active Directory Domain Services and Lightweight Directory Services Tools** feature.
>
> You'll also need:
>
> - A domain-joined computer
> - Network connectivity to a domain controller
> - Permission to read Active Directory user objects
>
> Most domain users can read standard user attributes by default, making this report accessible even in environments where administrative privileges are restricted.

# Creating an Active Directory User Report with PowerShell

As I continue learning PowerShell, I've found that the best way to improve is by building tools that solve real-world problems. One common task for system administrators is generating reports from Active Directory, whether for audits, troubleshooting, or simply understanding the current state of user accounts.

In this article, we'll build a simple Active Directory user report that gathers useful account information and displays it in several different formats. The report can be used by administrators or auditors to review user accounts while also serving as a practical PowerShell learning exercise.

## Prerequisites

To follow along, you'll need:

- The Active Directory PowerShell module installed
- Permissions to query Active Directory
- A domain-joined system
- Basic familiarity with running PowerShell commands

## Gathering Information and Setting Variables

Before we build the report, we need to gather some information from our current domain and define a few variables.

```powershell
# Gather information and create some variables we'll use later

$DomainControllers = Get-ADDomainController -Filter * |
    Select-Object -ExpandProperty HostName

$date = (Get-Date).DateTime
$simpledate = Get-Date -Format "MMM dd yyyy"
```

This code performs two tasks:

1. Retrieves the hostname of each domain controller in the current domain and stores them in the `$DomainControllers` variable.
2. Creates date variables that can be used later in report names, timestamps, or exported filenames.

Even though we won't use the domain controller list immediately, gathering this information early can be useful as reports become more advanced.

## Understanding Active Directory Logon Attributes

Before generating the report, it's important to understand the different logon-related attributes that Active Directory provides. These attributes are often confused because they sound similar, but they serve different purposes.

### LastLogon

`lastLogon` contains the most accurate logon timestamp for a user account. However, it is **not replicated between domain controllers**.

If a user authenticates against different domain controllers over time, each domain controller may contain a different `lastLogon` value. To determine the true most recent logon time, you must query every domain controller and compare the results.

**Best used when:**

- Performing inactivity audits
- Investigating account usage
- Determining the most recent authentication time

### LastLogonTimestamp

`lastLogonTimestamp` is a replicated attribute designed to support inactivity reporting across a domain.

Active Directory updates this value periodically rather than during every authentication event. The result is lower replication traffic, but the timestamp may not reflect a user's most recent login.

**Best used when:**

- Identifying stale accounts
- User lifecycle management
- Domain-wide reporting

### LastLogonDate

`LastLogonDate` is not actually stored in Active Directory.

Instead, the Active Directory PowerShell module converts the `lastLogonTimestamp` value into a human-readable date and presents it as `LastLogonDate`.

Because it is based on `lastLogonTimestamp`, it shares the same replication behavior and limitations.

**Best used when:**

- Administrative reporting
- General account reviews
- Simplified audit reports

For this report, we'll use `LastLogonDate`. It provides an easy-to-read date while avoiding the complexity of querying every domain controller and calculating the most recent `lastLogon` value.

## Querying Active Directory for User Information

Now that we've reviewed the logon attributes, we can retrieve user information from Active Directory.

```powershell
$AllUsers = Get-ADUser -Filter * `
    -Properties LastLogonDate,
                Enabled,
                CanonicalName,
                PasswordExpired,
                WhenCreated,
                AccountExpirationDate |
    Select-Object SamAccountName,
                  Enabled,
                  LastLogonDate,
                  CanonicalName,
                  PasswordExpired,
                  WhenCreated,
                  AccountExpirationDate
```

Although the query looks complex at first glance, it performs a fairly straightforward task: retrieve user account information and store the results in the `$AllUsers` variable for reporting.

The report includes the following properties:

| Property | Description |
|-----------|-------------|
| SamAccountName | User logon name |
| Enabled | Indicates whether the account is enabled |
| LastLogonDate | Most recent replicated logon date |
| CanonicalName | The account's location within Active Directory |
| PasswordExpired | Indicates whether the password has expired |
| WhenCreated | Date the account was created |
| AccountExpirationDate | Date the account is configured to expire |

One of the easiest ways to customize this report is by adding or removing properties from the `-Properties` and `Select-Object` parameters.

For example, if you wanted to include a user's email address, you could add:

```powershell
EmailAddress
```

to both sections of the query.

## Displaying the Report with Out-GridView

Once we have our data, there are several ways to view it. We could display it in the console, export it to a file, generate an HTML report, or use PowerShell's built-in graphical interface.

One of the simplest options is `Out-GridView`.

```powershell
# Display the report in an interactive grid

$AllUsers | Out-GridView
```

`Out-GridView` opens a separate window that allows you to:

- Search the results
- Filter records
- Sort by individual columns
- Quickly review account information

This is particularly useful during troubleshooting because you can interact with the data immediately without exporting it first.

## Exporting the Report to CSV

While `Out-GridView` is useful for reviewing information on your own system, exporting the report makes it easier to share with other administrators, auditors, or management teams.

```powershell
$AllUsers | Export-Csv C:\Temp\Users.csv -NoTypeInformation
```

The `-NoTypeInformation` parameter removes the extra type header that older versions of PowerShell